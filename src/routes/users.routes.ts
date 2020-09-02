import { Router } from 'express'
import User from '@models/User'

const usersRoutes = Router()

usersRoutes.get('/', async (req, res) => {
  const users = await User.find()

  return res.status(200).json(users)
})

usersRoutes.delete('/', async (req, res) => {
  const result = await User.deleteMany({})

  res.status(204).json(result)
})

usersRoutes.delete('/:userId', async (req, res) => {
  res.status(204).json(await User.findByIdAndDelete(req.params.userId))
})

export default usersRoutes
