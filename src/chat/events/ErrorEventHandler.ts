import { SocketUnexpectedError } from '@/errors'
import { SocketContext } from '@/protocols'
import { SocketErrorHandler } from '../../utils'

export async function ErrorEventHandler(context: SocketContext): Promise<void> {
  const { error } = context.payload

  return SocketErrorHandler(context, new SocketUnexpectedError(error))
}
