/* eslint-disable no-console */
import socketio, { Socket } from 'socket.io'
import http from 'http'
import User from '@models/User'
import { SocketAuthenticationError } from '../../errors'

const allowedOrigins = 'http://localhost:* http://127.0.0.1:*'

export default {
  async init(server: http.Server): Promise<void> {
    await User.updateMany({}, { devices: [] })

    const io = socketio(server, {
      pingInterval: 5000,
      pingTimeout: 1000,
      origins: allowedOrigins,
    })

    const ChatManager = io.of('/chat')

    ChatManager.use(async (socket: Socket, next: Function) => {
      try {
        const { Authorization, userId, userName } = socket.handshake.query
        if (Authorization === 'user') {
          let user = (
            await User.find({ reference: { id: userId, type: 'user' } }).limit(
              1,
            )
          )[0]
          if (!user) {
            user = await User.create({
              reference: {
                id: userId,
                type: 'user',
              },
              role: 'user',
              name: userName,
              devices: [socket.id],
            })
            console.log(`User registered: ${user.name}`)
            return next()
          }
          user.devices.push(socket.id)
          await user.save()
          console.log(`User authenticated: ${user.name}`)
          return next()
        }
        return next(new SocketAuthenticationError('Invalid Token'))
      } catch (err) {
        return next(new Error(err))
      }
    })

    ChatManager.on('connection', async socket => {
      const user = (await User.find({ devices: [socket.id] }).limit(1))[0]
      if (!user) {
        console.log(`user not found: ${socket.id}`)
        setTimeout(async () => {
          const userRetry = (
            await User.find({ devices: [socket.id] }).limit(1)
          )[0]
          if (!userRetry) {
            console.log('user not found again')
          }
        }, 2000)
      }

      socket.on('disconnecting', async () => {
        try {
          user.devices.splice(user.devices.indexOf(socket.id), 1)
          user.save()
        } catch (err) {
          console.log('Error while remove socket id: ', err)
        }
      })

      socket.on('disconnect', async reason => {
        console.log(`${user.name} disconnected 'cause ${reason}`)
      })

      socket.on('error', error => {
        console.log(`User error: ${error}`)
      })
    })
  },
}
