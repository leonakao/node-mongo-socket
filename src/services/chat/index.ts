/* eslint-disable no-console */
import socketio from 'socket.io'
import http from 'http'
import { Authentication } from './middlewares/auth'
import {
  DisconnectingEventHandler,
  ErrorEventHandler,
  NewMessageEventHandler,
} from './helpers'

const allowedOrigins = 'http://localhost:* http://127.0.0.1:*'

export default {
  async init(server: http.Server): Promise<void> {
    const io = socketio(server, {
      pingInterval: 5000,
      pingTimeout: 1000,
      origins: allowedOrigins,
    })

    const ChatManager = io.of('/chat')

    ChatManager.use(Authentication)

    ChatManager.on('connection', async socket => {
      if (!socket.currentUser) {
        console.log('User not found')
        socket.disconnect()
      }

      const context = {
        channel: ChatManager,
        socket,
      }

      socket.join(socket.currentUser._id)

      socket.on('disconnecting', () => {
        DisconnectingEventHandler({ ...context })
      })

      socket.on('error', error => {
        ErrorEventHandler({ ...context, payload: { error } })
      })

      socket.on('newMessage', payload => {
        NewMessageEventHandler({ ...context, payload })
      })
    })
  },
}
