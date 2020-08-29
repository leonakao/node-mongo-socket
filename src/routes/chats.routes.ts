import { Router } from 'express'
import Chat from '@models/Chat'

const chatRouter = Router()

chatRouter.get('/', async (req, res) => {
  const chats = await Chat.find().populate('members').populate('messages')

  return res.json(chats)
})

export default chatRouter
