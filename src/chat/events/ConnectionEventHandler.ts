import { Socket, Namespace } from 'socket.io'
import { SocketContext } from '@/protocols'
import {
  DisconnectingEventHandler,
  ErrorEventHandler,
  NewMessageEventHandler,
} from '.'

export async function ConnectionEventHandler(
  socket: Socket,
  channel: Namespace,
): Promise<void> {
  if (!socket.currentUser) {
    // eslint-disable-next-line no-console
    console.log('User not found')
    socket.disconnect()
  }

  const context: SocketContext = {
    channel,
    socket,
  }

  socket.join(socket.currentUser._id)

  socket.on('disconnecting', () => {
    DisconnectingEventHandler({ ...context })
  })

  socket.on('error', error => {
    ErrorEventHandler({ ...context, payload: { error } })
  })

  socket.on('newMessage', payload => {
    NewMessageEventHandler({ ...context, payload })
  })
}
