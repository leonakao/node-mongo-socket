import { UserDocument } from '@models/User'

export interface OrderInterface {
  id: string
  user: UserDocument
  delivery?: UserDocument
  restaurant: UserDocument
}
