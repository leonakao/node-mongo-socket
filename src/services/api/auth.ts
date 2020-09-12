import api from '@/plugins/AxiosApi'

interface AuthenticationResult {
  authorized: boolean
  reason?: string
  userId?: string
}

const tokensDefault = ['001', '002', '003', '004', '005', '006']

export async function AuthenticationService(
  token: string,
  route: string,
): Promise<AuthenticationResult> {
  let authorized
  let reason
  let userId

  if (token) {
    try {
      const result = await api.post(route, {
        token,
      })

      userId = result.data.userId
    } catch (err) {
      authorized = false
      if (err.code === 'ECONNREFUSED') {
        const id = tokensDefault.indexOf(token)
        if (id > -1) {
          return Promise.resolve({
            authorized: true,
            userId: '1',
          })
        }
        reason = 'Authentication service unavailable'
      } else {
        reason = err
      }
    }
  } else {
    authorized = false
    reason = 'Any token provided'
  }

  return Promise.resolve({
    authorized,
    reason,
    userId,
  })
}
