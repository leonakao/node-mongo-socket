/* eslint-disable no-console */
import socketio, { Socket } from 'socket.io'
import http from 'http'
import User from '@models/User'
import { SocketAuthenticationError } from '../../errors'

const allowedOrigins = 'http://localhost:* http://127.0.0.1:*'

export default {
  init(server: http.Server): void {
    const io = socketio(server, {
      pingInterval: 10000,
      pingTimeout: 5000,
      origins: allowedOrigins,
    })

    const ChatManager = io.of('/chat')

    ChatManager.use(async (socket: Socket, next: Function) => {
      try {
        const { Authorization, userId, userName } = socket.handshake.query
        if (Authorization === 'user') {
          let user = (
            await User.find({ reference: userId, type: 'user' }).limit(1)
          )[0]
          if (!user) {
            user = await User.create({
              reference: userId,
              type: 'user',
              role: 'user',
              name: userName,
              socket: socket.id,
            })
            console.log(`User registered: ${user.reference}`)
            return next()
          }
          await user.updateOne({
            socket: socket.id,
          })
          console.log(`User authenticated: ${user.reference}`)
          return next()
        }
        return next(new SocketAuthenticationError('Invalid Token'))
      } catch (err) {
        return next(new Error(err))
      }
    })

    ChatManager.on('connection', async socket => {
      const user = (await User.find({ socket: socket.id }).limit(1))[0]
      if (!user) {
        socket.disconnect(true)
      }

      socket.on('disconnect', async reason => {
        user.updateOne({
          socket: null,
        })
        console.log(`socket disconnected: ${socket.id}`)
        console.log(`Reason: ${reason}`)
      })

      socket.on('error', error => {
        console.log(`User error: ${error}`)
      })
    })
  },
}
