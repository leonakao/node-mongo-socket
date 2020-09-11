import { SocketUnexpectedError } from '@/errors'
import Message from '@models/Message'
import Room from '@models/Room'
import { SocketContext } from '@/protocols'
import { SocketErrorHandler } from '../../utils'

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
    return SocketErrorHandler(context, new SocketUnexpectedError(err.message))
  }
}
