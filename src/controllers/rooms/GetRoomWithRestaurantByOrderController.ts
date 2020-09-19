import { ControllerProtocol, HttpResponse } from '@/protocols'
import { Request } from 'express'
import Room from '@models/Room'
import { FindOrderHelper } from '@/helpers'
import { NotFoundError, UnexpectedError } from '@/errors'
import { ErrorHandler } from '@/utils'

export class GetRoomWithRestaurantByOrderController
  implements ControllerProtocol {
  async handle(req: Request): Promise<HttpResponse> {
    try {
      const { orderId } = req.params

      let room = await Room.findOne({
        orderId,
      })

      if (!room) {
        const { currentUser } = req
        if (currentUser.role === 'support')
          return ErrorHandler(new NotFoundError('room'))
        const order = await FindOrderHelper(orderId)
        if (!order) return ErrorHandler(new NotFoundError('order'))

        const members = [currentUser._id, order.restaurant._id]
        const type =
          currentUser.reference.type === 'user'
            ? 'user_order'
            : 'delivery_order'

        room = await Room.create({
          members,
          type,
          name: `Order ${order.id}`,
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
