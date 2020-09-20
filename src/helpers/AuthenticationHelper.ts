import User, { UserDocument } from '@models/User'
import { AuthenticationError, UnexpectedError } from '@/errors'
import { AuthenticationService, ServiceFindUserById } from '@/services/api'
import { EndPoints } from '@config/api'

interface AuthenticationResult {
  authorized: boolean
  user?: UserDocument
  reason?: string
}

const TypesAuthorizations = [
  { type: 'user', token: 'user', endPoint: 'auth/user', role: 'user' },
  { type: 'rest', token: 'rest', endPoint: 'auth/rest', role: 'restaurant' },
  { type: 'supt', token: 'supt', endPoint: 'auth/supt', role: 'support' },
  {
    type: 'delivery',
    token: 'delivery',
    endPoint: 'auth/delivery',
    role: 'delivery',
  },
]

export async function AuthenticationHelper(
  token: string,
  identifyToken: string,
): Promise<AuthenticationResult> {
  try {
    const typeAuthorized = TypesAuthorizations.find(
      typeAuth => typeAuth.token === identifyToken,
    )
    if (!typeAuthorized) {
      return Promise.resolve({
        authorized: false,
        reason: 'Invalid identification token',
      })
    }
    const typeEndPoints = EndPoints.find(
      endPoint => endPoint.type === typeAuthorized.type,
    )
    if (!typeEndPoints) {
      throw new UnexpectedError('Type Endpoint not found')
    }

    const auth = await AuthenticationService(token, typeEndPoints.auth)
    if (auth.authorized) {
      let user = await User.findOne({
        reference: { id: auth.userId, type: typeAuthorized.type },
      })
      if (!user) {
        try {
          const userData = await ServiceFindUserById(
            auth.userId,
            typeEndPoints.find,
          )
          if (userData) {
            user = await User.create({
              reference: {
                id: auth.userId,
                type: typeAuthorized.type,
              },
              role: typeAuthorized.role,
              name: userData.name,
            })
          } else {
            throw new UnexpectedError('User data not found')
          }
        } catch (err) {
          throw new UnexpectedError(err.message)
        }
      }
      return Promise.resolve({
        authorized: true,
        user,
      })
    }
    return Promise.resolve(auth)
  } catch (err) {
    if (err instanceof AuthenticationError) {
      return Promise.resolve({
        authorized: false,
        reason: err.message,
      })
    }
    return Promise.reject(err)
  }
}
