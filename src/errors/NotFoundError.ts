import { ErrorProtocol } from '@/protocols'

export class NotFoundError extends Error implements ErrorProtocol {
  constructor(element: string) {
    super(`Not Found`)
    this.message = `${element} not found`
    this.status = 404
  }

  status: number
}
