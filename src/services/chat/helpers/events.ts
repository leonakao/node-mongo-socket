import Message from '@models/Message'
import Room from '@models/Room'
import { SocketUnexpectedError } from '../../../errors'
import { SocketContext } from '../protocols'
import { ErrorHandler } from '../utils'

export async function DisconnectingEventHandler(
  context: SocketContext,
): Promise<void> {
  const { socket } = context

  socket.leaveAll()
}

export async function ErrorEventHandler(context: SocketContext): Promise<void> {
  const { error } = context.payload

  return ErrorHandler(context, new SocketUnexpectedError(error))
}

export async function NewMessageEventHandler(
  context: SocketContext,
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
    return ErrorHandler(context, new SocketUnexpectedError(err.message))
  }
}
