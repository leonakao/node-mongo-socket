/* eslint-disable no-console */
import socketio from 'socket.io'
import http from 'http'
import Room from '@models/Room'
import Message from '@models/Message'
import { MessageReceive } from './protocols'
import { Authentication } from './middlewares/auth'

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

      socket.join(socket.currentUser._id)

      socket.on('disconnecting', async () => {
        try {
          socket.leaveAll()
        } catch (err) {
          console.log('Error while remove socket id: ', err)
        }
      })

      socket.on('disconnect', async reason => {
        console.log(`${socket.currentUser.name} disconnected 'cause ${reason}`)
      })

      socket.on('error', error => {
        console.log(`User error: ${error}`)
      })

      socket.on('newMessage', async payload => {
        try {
          const { roomId, message }: MessageReceive = payload

          const room = await Room.findById(roomId).populate('members')
          if (!room) throw new Error('Room not found')

          const savedMessage = await Message.create({
            content: message,
            from: socket.currentUser._id,
            room: room._id,
          })

          await Message.populate(savedMessage, {
            path: 'from',
            model: 'User',
            select: ['reference', 'name'],
          })

          room.messages.push(savedMessage._id)
          room.save()

          room.members.forEach(member => {
            ChatManager.to(member._id).emit('newMessage', savedMessage)
          })
        } catch (err) {
          console.error(err)
        }
      })
    })
  },
}
