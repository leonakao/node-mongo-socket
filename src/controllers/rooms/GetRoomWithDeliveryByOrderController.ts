import { ControllerProtocol, HttpResponse } from '@/protocols'
import { Request } from 'express'
import Room from '@models/Room'
import { FindOrderHelper } from '@/helpers'
import { NotFoundError, UnexpectedError } from '@/errors'
import { ErrorHandler } from '@/utils'

export class GetRoomWithDeliveryByOrderController
  implements ControllerProtocol {
  async handle(req: Request): Promise<HttpResponse> {
    try {
      const { currentUser, params } = req
      const { orderId } = params

      const type = ((): string => {
        if (currentUser.role === 'user') return 'user_order_delivery'
        if (currentUser.role === 'restaurant') return 'delivery_order'
        return undefined
      })()

      if (!type) {
        throw new Error('Current User unexpected')
      }

      let room = await Room.findOne({
        orderId,
        type,
      })

      if (!room) {
        const order = await FindOrderHelper(orderId)
        if (!order) return ErrorHandler(new NotFoundError('order'))

        const members = [currentUser._id, order.delivery._id]

        room = await Room.create({
          members,
          type,
          name: `Order ${order.id} - delivery with ${currentUser.role}`,
          orderId,
        })
      }

      return {
        status: 200,
        body: room,
      }
    } catch (err) {
      return ErrorHandler(new UnexpectedError(err.message))
    }
  }
}
