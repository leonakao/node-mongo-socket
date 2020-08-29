import { Router } from 'express'
import Chat from '@models/Chat'

const chatRouter = Router()

chatRouter.get('/', async (req, res) => {
  const chats = await Chat.find().populate('members').populate('messages')

  return res.json(chats)
})

chatRouter.post('/', async (req, res) => {
  const { members, references } = req.body

  const chat = await Chat.create({
    members,
    references,
  })

  return res.status(201).json(chat)
})

export default chatRouter
