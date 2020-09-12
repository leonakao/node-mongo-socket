/* eslint-disable no-console */
import socketio from 'socket.io'
import http from 'http'
import { Authentication } from './middlewares/auth'
import { ConnectionEventHandler } from './events'

export default {
  async init(server: http.Server): Promise<void> {
    const io = socketio(server, {
      pingInterval: 5000,
      pingTimeout: 1000,
      origins: process.env.CHAT_ALLOWED_ORIGINS || '*:*',
    })

    const ChatManager = io.of('/chat')

    ChatManager.use(Authentication)

    ChatManager.on('connection', async socket => {
      ConnectionEventHandler(socket, ChatManager)
    })
  },
}
