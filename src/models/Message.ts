import mongoose, { Document, Schema } from 'mongoose'
import '@models/User'
import { RoomDocument } from '@models/Room'

export interface MessageDocument extends Document {
  content: string
  from: string
  room: string | RoomDocument
}

const MessageSchema = new Schema(
  {
    content: { type: String, required: true },
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    room: { type: Schema.Types.ObjectId, ref: 'Room' },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<MessageDocument>('Message', MessageSchema)
