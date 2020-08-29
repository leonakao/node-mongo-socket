import mongoose, { Document, Schema } from 'mongoose'
import '@models/User'
import '@models/Message'
import { ReferenceModel } from './Reference'

export interface ChatDocument extends Document {
  members?: string[]
  messages?: string[]
  references: ReferenceModel[]
}

const ChatSchema = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    references: [{ type: Object, required: true }],
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<ChatDocument>('Chat', ChatSchema)
