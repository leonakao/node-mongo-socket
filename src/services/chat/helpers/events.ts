import { Socket, Namespace } from 'socket.io'
import Message from '@models/Message'
import Room from '@models/Room'

interface ContextEvent {
  socket: Socket
  payload?: {
    error?: string
    roomId?: string
    message?: string
  }
  channel: Namespace
}

export async function DisconnectingEventHandler(
  context: ContextEvent,
): Promise<void> {
  const { socket } = context

  socket.leaveAll()
}

export async function ErrorEventHandler(context: ContextEvent): Promise<void> {
  const { channel, socket, payload } = context

  const { error } = payload

  channel.to(socket.id).emit('error', error || payload)
}

export async function NewMessageEventHandler(
  context: ContextEvent,
): Promise<void> {
  try {
    const { socket, channel, payload } = context
    const { roomId, message } = payload

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
      channel.to(member._id).emit('newMessage', savedMessage)
    })
  } catch (err) {
    console.error(err)
  }
}
