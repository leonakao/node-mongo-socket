import { Router } from 'express'
import RoomRoutes from './rooms.routes'

const router = Router()

router.use('/rooms', RoomRoutes)

export default router
