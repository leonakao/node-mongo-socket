import { Router } from 'express'
import User from '@models/User'
import Room from '@models/Room'
import {
  GetRoomByOrderController,
  GetRoomsController,
} from '@/controllers/rooms'
import messagesRoutes from './messages.routes'
import { NotIsRestaurant } from './middlewares'

const roomsRoutes = Router()

roomsRoutes.get('/', async (req, res) => {
  const controller = new GetRoomsController()
  const response = await controller.handle(req)
  return res.status(response.status).json(response.body)
})

roomsRoutes.get('/order/:orderId', NotIsRestaurant, async (req, res) => {
  const controller = new GetRoomByOrderController()
  const response = await controller.handle(req)
  res.status(response.status).json(response.body)
})

roomsRoutes.post('/', async (req, res) => {
  const { members = [], name, type = 'user_order', orderId } = req.body

  if (type === 'user_order') {
    const rest = await User.findOne({
      'reference.type': 'rest',
    })
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

roomsRoutes.delete('/:roomId', async (req, res) => {
  await Room.findByIdAndDelete(req.params.roomId)
  res.status(204).send()
})

roomsRoutes.delete('/', async (req, res) => {
  await Room.deleteMany({})
  res.status(204).send()
})

roomsRoutes.use('/messages', messagesRoutes)

export default roomsRoutes
