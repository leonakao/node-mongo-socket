import { Request } from 'express'
import { HttpResponse } from '.'

export interface ControllerProtocol {
  handle(request: Request): Promise<HttpResponse>
}
