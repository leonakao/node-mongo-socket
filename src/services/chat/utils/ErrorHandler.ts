import { SocketContext } from '../protocols'
import { SocketError } from '../../../errors/protocols'

export function ErrorHandler(context: SocketContext, error: SocketError): void {
  const { socket, channel } = context

  channel.to(socket.id).emit('error', error.data)
}
