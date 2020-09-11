import { Socket } from 'socket.io'
import User from '@models/User'
import { SocketAuthenticationError, SocketUnexpectedError } from '@/errors'

export async function Authentication(
  socket: Socket,
  next: Function,
): Promise<void> {
  try {
    const { Authorization, userId, userName } = socket.handshake.query

    const AuthorizationKeys = [
      { token: process.env.TOKEN_AUTH_USER, type: 'user' },
      { token: process.env.TOKEN_AUTH_RESTAURANT, type: 'rest' },
      { token: process.env.TOKEN_AUTH_SUPPORT, type: 'delivery' },
      { token: process.env.TOKEN_AUTH_DELIVERY, type: 'supt' },
    ]

    const AuthorizedKey = AuthorizationKeys.find(
      auth => auth.token === Authorization,
    )

    if (Authorization && AuthorizedKey) {
      let user = await User.findOne({
        reference: { id: userId, type: AuthorizedKey.type },
      })
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
      return next(null, true)
    }
    return next(new SocketAuthenticationError('Invalid Token'), false)
  } catch (err) {
    return next(new SocketUnexpectedError(err.message), false)
  }
}
