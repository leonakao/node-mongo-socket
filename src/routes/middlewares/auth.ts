import { Response, Request } from 'express'
import { AuthenticationHelper } from '@/helpers'

export async function Authentication(
  request: Request,
  response: Response,
  next: Function,
): Promise<void | Response> {
  try {
    const { identification, authorization } = request.headers

    const auth = await AuthenticationHelper(
      authorization,
      identification as string,
    )

    if (auth.authorized) {
      request.currentUser = auth.user
      return next()
    }
    return response.status(401).json({ reason: auth.reason })
  } catch (err) {
    return response.status(err.status || 500).json({ reason: err.message })
  }
}
