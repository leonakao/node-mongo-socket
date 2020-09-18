import User, { UserDocument } from '@models/User'
import { ServiceFindUserById } from '@/services/api'
import { EndPoints } from '@config/api'

export async function FindUserById(userId: string): Promise<UserDocument> {
  let user = await User.findOne({
    reference: { id: userId, type: 'user' },
  })

  if (!user) {
    const userEndPoints = EndPoints.find(endpoint => endpoint.type === 'user')

    const findEndPoint = userEndPoints.find
    const userData = await ServiceFindUserById(userId, findEndPoint)

    user = await User.create({
      name: userData.name,
      reference: { id: userData.id, type: 'user' },
      role: 'user',
    })
  }

  return user
}
