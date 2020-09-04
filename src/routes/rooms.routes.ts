import { Router } from 'express'
import User from '@models/User'
import Room from '@models/Room'

const roomsRoutes = Router()

roomsRoutes.get('/', async (req, res) => {
  const rooms = await Room.find().populate('members').populate('messages')

  return res.json(rooms)
})

roomsRoutes.post('/', async (req, res) => {
  const { members = [], name, type = 'user_order', orderId } = req.body

  if (type === 'user_order') {
    const rest = await User.findOne({ reference: { type: 'rest' } })
    if (rest) {
      members.push(rest._id)
    }
  }

  if (req.currentUser) {
    members.push(req.currentUser._id)
  }

  const room = await Room.create({
    name,
    members,
    type,
    orderId,
  })

  return res.status(201).json(room)
})

export default roomsRoutes
