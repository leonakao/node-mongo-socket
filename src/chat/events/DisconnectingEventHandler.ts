import { SocketContext } from '@/protocols'

export async function DisconnectingEventHandler(
  context: SocketContext,
): Promise<void> {
  const { socket } = context

  socket.leaveAll()
}
