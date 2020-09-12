export class UnexpectedError extends Error {
  message: string

  status: number

  constructor(reason: string) {
    super('Unexpected Error occurred')
    this.message = reason
    this.status = 500
  }
}
