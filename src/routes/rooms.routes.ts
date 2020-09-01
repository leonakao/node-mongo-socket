import { Router } from 'express'
import Room from '@models/Room'

const roomRouter = Router()

roomRouter.get('/', async (req, res) => {
  const rooms = await Room.find().populate('members').populate('messages')

  return res.json(rooms)
})

roomRouter.post('/', async (req, res) => {
  const { members, references, name } = req.body

  const room = await Room.create({
    name,
    members,
    references,
  })

  return res.status(201).json(room)
})

export default roomRouter
