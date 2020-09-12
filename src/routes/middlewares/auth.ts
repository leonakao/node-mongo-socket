import { Response } from 'express'
import { AuthenticationHelper } from '@/helpers'

export async function Authentication(
  request,
  response: Response,
  next: Function,
): Promise<void | Response> {
  try {
    const { authorization, identification } = request.headers

    const auth = await AuthenticationHelper(authorization, identification)

    if (auth.authorized) {
      request.currentUser = auth.user
      return next()
    }
    response.status(401).json({ reason: auth.reason })
  } catch (err) {
    response.status(err.status || 500).json({ reason: err.message })
  }
}
