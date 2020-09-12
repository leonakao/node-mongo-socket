import { UserDocument } from '@models/User'
import api from '@/plugins/AxiosApi'

interface User {
  id: string | number
  name: string
}

const usersDefault: User[] = [
  { id: 1, name: 'User Default 1' },
  { id: 2, name: 'User Default 2' },
  { id: 3, name: 'User Default 3' },
  { id: 4, name: 'User Default 4' },
  { id: 5, name: 'User Default 5' },
  { id: 6, name: 'User Default 6' },
]

export async function FindUserById(
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
    const userDefault = usersDefault.find(user => user.id === id)
    if (userDefault) {
      return Promise.resolve(userDefault)
    }
    return Promise.reject(err)
  }
}
