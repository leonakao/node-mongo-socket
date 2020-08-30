import socketio from 'socket.io'
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

    io.use((socket, next) => {
      const token = socket.handshake.query.Authorization || null
      if (token === 'token') {
        return next()
      }
      return next(new SocketAuthenticationError('Invalid Token'))
    })

    io.on('connection', socket => {
      // eslint-disable-next-line no-console
      console.log(`User connected: ${socket.id}`)

      socket.on('disconnect', reason => {
        console.log(`User disconnected: ${socket.id}`)
        console.log(`Reason: ${reason}`)
      })

      socket.on('error', error => {
        console.log(`User error: ${error}`)
      })
    })
  },
}
