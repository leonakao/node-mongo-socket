import { ControllerProtocol, HttpResponse } from '@/protocols'
import { Request } from 'express'
import Room from '@models/Room'
import { FindUserById } from '@/helpers'
import { NotFoundError, UnexpectedError } from '@/errors'
import { ErrorHandler } from '@/utils'

export class GetRoomByUserController implements ControllerProtocol {
  async handle(req: Request): Promise<HttpResponse> {
    try {
      const { userId } = req.params

      const user = await FindUserById(userId)

      if (!user) {
        return ErrorHandler(new NotFoundError('User'))
      }

      let room = await Room.findOne({
        members: { $elemMatch: { $eq: user._id } },
        type: 'support_user',
      })

      if (!room) {
        const { currentUser } = req

        const members = [currentUser._id, user._id]
        const type = 'support_user'

        room = await Room.create({
          members,
          type,
          name: `User ${user.reference.id}`,
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
