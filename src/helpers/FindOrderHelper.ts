import { getOrderDetails } from '@/services/api'
import { OrderInterface } from '@/protocols'
import User from '@models/User'
import { NotFoundError } from '@/errors'

export async function FindOrderHelper(
  orderId: string,
): Promise<OrderInterface> {
  try {
    const order = await getOrderDetails(orderId)

    const user = await User.findOne({
      reference: {
        id: order.user,
        type: 'user',
      },
    })

    const restaurant = await User.findOne({
      reference: { type: 'restaurant', id: order.restaurant },
    })

    const delivery = await User.findOne({
      reference: { type: 'delivery', id: order.delivery || '0' },
    })

    return {
      id: order.id,
      user,
      restaurant,
      delivery,
    }
  } catch (err) {
    if (err instanceof NotFoundError) {
      return undefined
    }
    throw err
  }
}
