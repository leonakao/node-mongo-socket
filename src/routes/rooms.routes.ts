import { Router } from 'express'
import Room from '@models/Room'
import {
  GetRoomWithRestaurantByOrderController,
  GetRoomsController,
  CreateRoomByOrderController,
  GetRoomController,
  GetRoomByUserController,
  GetRoomWithUserByOrderController,
  GetRoomWithDeliveryByOrderController,
  GetRoomByRestaurantController,
} from '@/controllers/rooms'
import messagesRoutes from './messages.routes'
import {
  NotIsRestaurant,
  IsSupport,
  NotIsSupport,
  NotIsUser,
  NotIsDelivery,
} from './middlewares'

const roomsRoutes = Router()

roomsRoutes.get('/', async (req, res) => {
  const controller = new GetRoomsController()
  const response = await controller.handle(req)
  return res.status(response.status).json(response.body)
})

roomsRoutes.get('/:roomId', async (req, res) => {
  const controller = new GetRoomController()
  const response = await controller.handle(req)
  return res.status(response.status).json(response.body)
})

roomsRoutes.get(
  '/order/:orderId/restaurant',
  NotIsRestaurant,
  NotIsSupport,
  async (req, res) => {
    const controller = new GetRoomWithRestaurantByOrderController()
    const response = await controller.handle(req)
    res.status(response.status).json(response.body)
  },
)

roomsRoutes.get(
  '/order/:orderId/user',
  NotIsUser,
  NotIsSupport,
  async (req, res) => {
    const controller = new GetRoomWithUserByOrderController()
    const response = await controller.handle(req)
    res.status(response.status).json(response.body)
  },
)

roomsRoutes.get(
  '/order/:orderId/delivery',
  NotIsDelivery,
  NotIsSupport,
  async (req, res) => {
    const controller = new GetRoomWithDeliveryByOrderController()
    const response = await controller.handle(req)
    res.status(response.status).json(response.body)
  },
)

roomsRoutes.get('/user/:userId', IsSupport, async (req, res) => {
  const controller = new GetRoomByUserController()
  const response = await controller.handle(req)
  res.status(response.status).json(response.body)
})

roomsRoutes.get('/restaurant/:restaurantId', IsSupport, async (req, res) => {
  const controller = new GetRoomByRestaurantController()
  const response = await controller.handle(req)
  res.status(response.status).json(response.body)
})

roomsRoutes.post('/', async (req, res) => {
  const controller = new CreateRoomByOrderController()
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
