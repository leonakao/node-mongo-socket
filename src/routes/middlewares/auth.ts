import { Response } from 'express'
import User from '@models/User'

export async function Authentication(
  request,
  response: Response,
  next: Function,
): Promise<void | Response> {
  const { authorization } = request.headers

  const Authorizations = [
    { reference: { id: '1', type: 'user' }, token: 'user' },
    { reference: { id: '1', type: 'rest' }, token: 'rest' },
    { reference: { id: '1', type: 'supt' }, token: 'supt' },
    { reference: { id: '1', type: 'moto' }, token: 'moto' },
  ]

  const userReference = Authorizations.find(
    auth => auth.token === authorization,
  )

  if (!userReference) {
    return response.status(401).json({ message: 'Invalid Authentication' })
  }

  let user = await User.findOne({
    reference: userReference.reference,
  })

  if (!user) {
    user = await User.create({
      name: 'Anonymous',
      reference: userReference.reference,
      role: userReference.token,
    })
  }

  if (!user) {
    return response
      .status(500)
      .json({ message: 'An unexpected error occurred' })
  }

  request.currentUser = user

  next()
}
