import { ControllerProtocol, HttpResponse } from '@/protocols'
import { Request } from 'express'
import Room from '@models/Room'
import { UnexpectedError, NotFoundError } from '@/errors'
import { ErrorHandler } from '@/utils'
import mongoose from 'mongoose'

export class GetRoomController implements ControllerProtocol {
  async handle(req: Request): Promise<HttpResponse> {
    try {
      const { currentUser } = req
      const { roomId } = req.params

      let filters = {
        open: true,
        _id: mongoose.Types.ObjectId(roomId),
      }

      if (currentUser.role !== 'support') {
        filters = Object.assign(filters, {
          members: { $elemMatch: { $eq: currentUser._id } },
        })
      }

      const room = (
        await Room.aggregate()
          .match(filters)
          .project({
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
      )[0]

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
