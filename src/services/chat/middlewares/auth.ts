import { Socket } from 'socket.io'
import User from '@models/User'
import { SocketAuthenticationError } from '../../../errors'

export async function Authentication(
  socket: Socket,
  next: Function,
): Promise<void> {
  try {
    const { Authorization, userId, userName } = socket.handshake.query
    if (
      Authorization === 'user' ||
      Authorization === 'rest' ||
      Authorization === 'supt' ||
      Authorization === 'moto'
    ) {
      let user = (
        await User.find({
          reference: { id: userId, type: Authorization },
        }).limit(1)
      )[0]
      if (!user) {
        user = await User.create({
          reference: {
            id: userId,
            type: Authorization,
          },
          role: Authorization,
          name: userName,
        })
      }
      // eslint-disable-next-line no-param-reassign
      socket.currentUser = user
      return next()
    }
    return next(new SocketAuthenticationError('Invalid Token'), false)
  } catch (err) {
    return next(new Error(err), false)
  }
}
