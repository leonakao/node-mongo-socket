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
      const { currentUser, params } = req
      const { orderId } = params
      const type = ((): string => {
        if (currentUser.role === 'delivery') return 'delivery_order'
        if (currentUser.role === 'user') return 'user_order'
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
        if (currentUser.role === 'support')
          return ErrorHandler(new NotFoundError('room'))
        const order = await FindOrderHelper(orderId)
        if (!order) return ErrorHandler(new NotFoundError('order'))

        const members = [currentUser._id, order.restaurant._id]

        room = await Room.create({
          members,
          type,
          name: `Order ${order.id} - restaurant with ${currentUser.role}`,
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
