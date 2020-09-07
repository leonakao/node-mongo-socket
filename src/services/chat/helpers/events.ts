import { Socket, Namespace } from 'socket.io'

interface ContextEvent {
  socket: Socket
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
  channel: Namespace
}

export async function DisconnectingEventHandler(
  context: ContextEvent,
): Promise<void> {
  const { socket } = context

  socket.leaveAll()
}
