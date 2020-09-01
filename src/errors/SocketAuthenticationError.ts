import { DataSocketError } from './protocols'

export class SocketAuthenticationError extends Error {
  data: DataSocketError

  constructor(reason: string) {
    super('Invalid authorization')
    this.data = {
      type: 'authorization_error',
      message: reason,
    }
  }
}
