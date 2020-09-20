import { Response, Request } from 'express'

export async function NotIsDelivery(
  request: Request,
  response: Response,
  next: Function,
): Promise<void | Response> {
  try {
    const { currentUser } = request
    if (currentUser.role !== 'delivery') {
      return next()
    }
    return response
      .status(403)
      .json({ reason: 'This route not is enable to delivery' })
  } catch (err) {
    return response.status(err.status || 500).json({ reason: err.message })
  }
}
