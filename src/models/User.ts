import mongoose, { Document, Schema } from 'mongoose'

interface Reference {
  type: string
  id?: string
}
export interface UserDocument extends Document {
  name: string
  reference: Reference
  role: string
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    reference: {
      type: { type: String, required: true },
      id: { type: String, required: true },
    },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<UserDocument>('User', UserSchema)
