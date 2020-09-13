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
    const { currentUser } = socket

    const room = await Room.findById(roomId)
    if (!room) throw new Error('Room not found')
    if (room.members.indexOf(currentUser._id) === -1)
      throw new Error('User not assigned to this room')

    const savedMessage = await Message.create({
      content: message,
      from: currentUser._id,
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
      channel.to(member).emit('newMessage', savedMessage)
    })
  } catch (err) {
    return SocketErrorHandler(context, new SocketUnexpectedError(err.message))
  }
}
