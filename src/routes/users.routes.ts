import { Router } from 'express'
import User from '@models/User'

const usersRoutes = Router()

usersRoutes.get('/', async (req, res) => {
  const users = await User.find()

  return res.status(200).json(users)
})

usersRoutes.delete('/', async (req, res) => {
  const { reference } = req.body

  const result = await User.deleteMany({ reference })

  res.status(204).json(result)
})

export default usersRoutes
