import { Socket } from 'socket.io'
import { AuthenticationHelper } from '@/helpers'
import { SocketAuthenticationError, SocketUnexpectedError } from '@/errors'

export async function Authentication(
  socket: Socket,
  next: Function,
): Promise<void> {
  try {
    const { Authorization, Identification } = socket.handshake.query

    const auth = await AuthenticationHelper(Authorization, Identification)

    if (auth.authorized) {
      socket.currentUser = auth.user
      return next(null, true)
    }

    return next(new SocketAuthenticationError(auth.reason), false)
  } catch (err) {
    return next(new SocketUnexpectedError(err.message), false)
  }
}
