import { Router } from 'express'
import Room from '@models/Room'

const roomRouter = Router()

roomRouter.get('/', async (req, res) => {
  const rooms = await Room.find().populate('members').populate('messages')

  return res.json(rooms)
})

roomRouter.post('/', async (req, res) => {
  const { members, references } = req.body

  const room = await Room.create({
    members,
    references,
  })

  return res.status(201).json(room)
})

export default roomRouter
