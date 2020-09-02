import mongoose, { Document, Schema } from 'mongoose'
import '@models/User'
import '@models/Message'

export interface RoomDocument extends Document {
  name: string
  members: string[]
  messages?: string[]
  type: string
  orderId?: string | number
  open?: boolean
}

const RoomSchema = new Schema(
  {
    name: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    type: { type: String, required: true },
    orderId: { type: String, required: false },
    open: { type: Boolean, required: false, default: true },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<RoomDocument>('Room', RoomSchema)
