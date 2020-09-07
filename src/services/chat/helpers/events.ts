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

export async function ErrorEventHandler(context: ContextEvent): Promise<void> {
  const { channel, socket, payload } = context

  const { error } = payload

  channel.to(socket.id).emit('error', error || payload)
}
