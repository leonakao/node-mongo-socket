import { Router } from 'express'
import RoomsRoutes from './rooms.routes'
import UsersRoutes from './users.routes'

import { Authentication } from './middlewares'

const router = Router()

router.use('/rooms', Authentication, RoomsRoutes)

router.use('/users', Authentication, UsersRoutes)

export default router
