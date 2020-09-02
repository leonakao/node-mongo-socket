import { Router } from 'express'
import Room from '@models/Room'

const roomsRoutes = Router()

roomsRoutes.get('/', async (req, res) => {
  const rooms = await Room.find().populate('members').populate('messages')

  return res.json(rooms)
})

roomsRoutes.post('/', async (req, res) => {
  const { members, references, name } = req.body

  const room = await Room.create({
    name,
    members,
    references,
  })

  return res.status(201).json(room)
})

roomsRoutes.delete('/:roomId', async (req, res) => {
  return res.status(204).json(await Room.findByIdAndDelete(req.params.roomId))
})

export default roomsRoutes
