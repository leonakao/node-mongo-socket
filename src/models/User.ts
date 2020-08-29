import mongoose, { Document, Schema } from 'mongoose'

export interface UserDocument extends Document {
  name: string
  image: string
  type: string
  reference: string
  socket: string
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: false },
    type: { type: String, required: true },
    reference: { type: String, required: true },
    socket: { type: String, required: false },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<UserDocument>('User', UserSchema)
