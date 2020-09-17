import User, { UserDocument } from '@models/User'
import { FindUserById } from '@/services/api'
import { EndPoints } from '@config/api'

export async function FindRestaurantById(
  restaurantId: string,
): Promise<UserDocument> {
  let restaurant = await User.findOne({
    reference: { type: 'restaurant', id: restaurantId },
  })

  if (!restaurant) {
    const restaurantEndPoints = EndPoints.find(
      endpoint => endpoint.type === 'rest',
    )

    const findEndPoint = restaurantEndPoints.find
    const restaurantData = await FindUserById(restaurantId, findEndPoint)

    restaurant = await User.create({
      name: restaurantData.name,
      reference: { type: 'restaurant', id: restaurantData.id },
      role: 'restaurant',
    })
  }

  return restaurant
}
