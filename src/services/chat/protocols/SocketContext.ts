import { Socket, Namespace } from 'socket.io'

export interface SocketContext {
  socket: Socket
  payload?: {
    error?: string
    roomId?: string
    message?: string
  }
  channel: Namespace
}
