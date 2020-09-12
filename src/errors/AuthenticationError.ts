export class AuthenticationError extends Error {
  message: string

  status: number

  constructor(reason: string) {
    super('Invalid authorization')
    this.message = reason
    this.status = 401
  }
}
