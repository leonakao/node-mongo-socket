import mongoose, { Document, Schema } from 'mongoose'
import { UserDocument } from './User'
import { MessageDocument } from './Message'
import { ReferenceModel } from './Reference'

export interface ChatDocument extends Document {
  members: UserDocument[]
  messages: MessageDocument[]
  reference: ReferenceModel
}

const ChatSchema = new Schema(
  {
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<ChatDocument>('Chat', ChatSchema)
