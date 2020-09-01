import { Router } from 'express'
import RoomsRoutes from './rooms.routes'
import UsersRoutes from './users.routes'

const router = Router()

router.use('/rooms', RoomsRoutes)

router.use('/users', UsersRoutes)

export default router
