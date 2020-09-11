import { DataSocketError } from '@/protocols'

export class SocketUnexpectedError extends Error {
  data: DataSocketError

  constructor(error: string) {
    super('Unexpected Error')
    this.data = {
      type: 'unexpected_error',
      message: error,
    }
  }
}
