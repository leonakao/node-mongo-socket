import { ControllerProtocol, HttpResponse } from '@/protocols'
import { Request } from 'express'
import Room from '@models/Room'
import User from '@models/User'
import { UnexpectedError } from '@/errors'
import { ErrorHandler } from '@/utils'

export class GetRoomsController implements ControllerProtocol {
  async handle(req: Request): Promise<HttpResponse> {
    try {
      const { members = [], name, type = 'user_order', orderId } = req.body

      if (type === 'user_order') {
        const rest = await User.findOne({
          'reference.type': 'rest',
        })
        if (rest) {
          members.push(rest._id)
        }
      }

      if (req.currentUser) {
        members.push(req.currentUser._id)
      }

      const room = await Room.create({
        name,
        members,
        type,
        orderId,
      })

      return {
        status: 201,
        body: room,
      }
    } catch (err) {
      return ErrorHandler(new UnexpectedError(err.message))
    }
  }
}
