import { DataSocketError } from './protocols'

export class SocketAuthenticationError extends Error {
  name: string

  data: DataSocketError

  constructor(reason: string) {
    super('Invalid authorization')
    this.name = 'Invalid authorization'
    this.data = {
      type: 'authorization_error',
      message: reason,
    }
  }
}
