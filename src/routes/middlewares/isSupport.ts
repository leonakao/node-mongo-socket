import { Response, Request } from 'express'

export async function IsSupport(
  request: Request,
  response: Response,
  next: Function,
): Promise<void | Response> {
  try {
    const { currentUser } = request
    if (currentUser.role === 'support') {
      return next()
    }
    return response
      .status(403)
      .json({ reason: 'This route is enable only to support' })
  } catch (err) {
    return response.status(err.status || 500).json({ reason: err.message })
  }
}
