import { ControllerProtocol, HttpResponse } from '@/protocols'
import { Request } from 'express'
import Room from '@models/Room'
import { UnexpectedError, NotFoundError } from '@/errors'
import { ErrorHandler } from '@/utils'

export class GetRoomController implements ControllerProtocol {
  async handle(req: Request): Promise<HttpResponse> {
    try {
      const { currentUser } = req
      const { roomId } = req.params

      let filters = {
        open: true,
        _id: roomId,
      }

      if (currentUser.role !== 'support') {
        filters = Object.assign(filters, {
          members: { $elemMatch: { $eq: currentUser } },
        })
      }

      const room = await Room.findOne(filters).select({
        name: 1,
        open: 1,
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        members: 1,
        countMessages: {
          $size: '$messages',
        },
      })

      if (!room) return ErrorHandler(new NotFoundError('Room'))

      return {
        status: 200,
        body: room,
      }
    } catch (err) {
      return ErrorHandler(new UnexpectedError(err.message))
    }
  }
}
