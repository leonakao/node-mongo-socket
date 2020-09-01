/* eslint-disable no-console */
import socketio, { Socket } from 'socket.io'
import http from 'http'
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

    ChatManager.use((socket: Socket, next: Function) => {
      const token = socket.handshake.query.Authorization || null
      if (token === 'token') {
        return next()
      }
      return next(new SocketAuthenticationError('Invalid Token'))
    })

    ChatManager.on('connection', user => {
      console.log(`User connected: ${user.id}`)

      user.on('disconnect', reason => {
        console.log(`User disconnected: ${user.id}`)
        console.log(`Reason: ${reason}`)
      })

      user.on('error', error => {
        console.log(`User error: ${error}`)
      })
    })
  },
}
