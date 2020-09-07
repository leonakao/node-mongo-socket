import { Router } from 'express'
import Message from '@models/Message'
import Room from '@models/Room'

const messagesRoutes = Router()

messagesRoutes.get('/:roomId', async (req, res) => {
  const room = await Room.findById(req.params.roomId)

  if (
    room.members.indexOf(req.currentUser._id) === -1 &&
    req.currentUser.role !== 'supt'
  ) {
    return res.status(403).send()
  }

  const messagesHistory = await Message.find({
    room: req.params.roomId,
  }).populate('from', ['name', 'reference', '_id'])

  return res.status(200).json(messagesHistory)
})

export default messagesRoutes
