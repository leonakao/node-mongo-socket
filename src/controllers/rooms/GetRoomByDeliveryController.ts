import { ControllerProtocol, HttpResponse } from '@/protocols'
import { Request } from 'express'
import Room from '@models/Room'
import { FindDeliveryById } from '@/helpers'
import { NotFoundError, UnexpectedError } from '@/errors'
import { ErrorHandler } from '@/utils'

export class GetRoomByDeliveryController implements ControllerProtocol {
  async handle(req: Request): Promise<HttpResponse> {
    try {
      const { deliveryId } = req.params

      const delivery = await FindDeliveryById(deliveryId)

      if (!delivery) {
        return ErrorHandler(new NotFoundError('Delivery'))
      }

      const type = 'support_delivery'

      let room = await Room.findOne({
        members: { $elemMatch: { $eq: delivery._id } },
        type,
      })

      if (!room) {
        const { currentUser } = req

        const members = [currentUser._id, delivery._id]
        room = await Room.create({
          members,
          type,
          name: `Support with Delivery ${delivery.reference.id}`,
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
