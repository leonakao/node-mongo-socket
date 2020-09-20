import User, { UserDocument } from '@models/User'
import { ServiceFindUserById } from '@/services/api'
import { EndPoints } from '@config/api'

export async function FindDeliveryById(
  deliveryId: string,
): Promise<UserDocument> {
  let delivery = await User.findOne({
    reference: { id: deliveryId, type: 'delivery' },
  })

  if (!delivery) {
    const deliveryEndPoints = EndPoints.find(
      endpoint => endpoint.type === 'delivery',
    )

    const findEndPoint = deliveryEndPoints.find
    const deliveryData = await ServiceFindUserById(deliveryId, findEndPoint)

    delivery = await User.create({
      name: deliveryData.name,
      reference: { id: deliveryData.id, type: 'delivery' },
      role: 'delivery',
    })
  }

  return delivery
}
