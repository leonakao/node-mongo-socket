import { DataSocketError, SocketError } from '../protocols'

export class SocketAuthenticationError extends Error implements SocketError {
  data: DataSocketError

  constructor(reason: string) {
    super('Invalid authorization')
    this.data = {
      type: 'authorization_error',
      message: reason,
    }
  }
}
