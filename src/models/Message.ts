import mongoose, { Document, Schema } from 'mongoose'
import { UserDocument } from './User'

export interface MessageDocument extends Document {
  content: string
  user: UserDocument
}

const MessageSchema = new Schema(
  {
    content: { type: String, required: true },
    user: { type: String, required: false },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<MessageDocument>('Message', MessageSchema)
