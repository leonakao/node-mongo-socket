import { Router } from 'express'
import ChatRoutes from './chats.routes'

const router = Router()

router.use('/chats', ChatRoutes)

export default router
