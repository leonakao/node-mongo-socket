import { SocketError, SocketContext } from '@/protocols'

export function SocketErrorHandler(
  context: SocketContext,
  error: SocketError,
): void {
  const { socket, channel } = context

  channel.to(socket.id).emit('error', error.data)
}
