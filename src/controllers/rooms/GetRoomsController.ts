import { ControllerProtocol, HttpResponse } from '@/protocols'
import { Request } from 'express'
import Room from '@models/Room'
import { UnexpectedError } from '@/errors'
import { ErrorHandler } from '@/utils'

export class GetRoomsController implements ControllerProtocol {
  async handle(req: Request): Promise<HttpResponse> {
    try {
      let filters = {
        open: true,
      }

      const { currentUser } = req

      if (currentUser.role !== 'support') {
        filters = Object.assign(filters, {
          members: { $elemMatch: { $eq: currentUser } },
        })
      }

      const rooms = await Room.find(filters).select({
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

      return {
        status: 200,
        body: rooms,
      }
    } catch (err) {
      return ErrorHandler(new UnexpectedError(err.message))
    }
  }
}
