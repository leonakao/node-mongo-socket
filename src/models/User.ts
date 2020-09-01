import mongoose, { Document, Schema } from 'mongoose'

export interface UserDocument extends Document {
  name: string
  type: string
  role: string
  reference: string
  socket: string
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    role: { type: String, required: true },
    reference: { type: String, required: true },
    socket: { type: String, required: false },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<UserDocument>('User', UserSchema)
