import { UserDocument } from '@models/User'
import api from '@/plugins/AxiosApi'

interface User {
  id: string | number
  name: string
}

const usersDefault: User[] = [
  { id: '1', name: 'Account Default 1' },
  { id: '2', name: 'Account Default 2' },
  { id: '3', name: 'Account Default 3' },
  { id: '4', name: 'Account Default 4' },
  { id: '5', name: 'Account Default 5' },
  { id: '6', name: 'Account Default 6' },
]

export async function ServiceFindUserById(
  id: string,
  endpoint: string,
): Promise<Partial<UserDocument>> {
  try {
    const result = await api.post(
      endpoint,
      {},
      {
        params: {
          id,
        },
      },
    )

    return Promise.resolve(result.data)
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      const userDefault = usersDefault.find(user => user.id === id)
      if (userDefault) {
        return Promise.resolve(userDefault)
      }
    }
    return Promise.reject(err)
  }
}
