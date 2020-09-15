import { ErrorProtocol, HttpResponse } from '@/protocols'

export function ErrorHandler(error: ErrorProtocol): HttpResponse {
  return {
    status: error.status,
    body: {
      message: error.message,
    },
  }
}
