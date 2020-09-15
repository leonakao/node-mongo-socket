import { Router } from 'express'
import Room from '@models/Room'
import {
  GetRoomByOrderController,
  GetRoomsController,
  CreateRoomController,
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
  const controller = new CreateRoomController()
  const response = await controller.handle(req)
  return res.status(response.status).json(response.body)
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
