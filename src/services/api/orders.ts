import { NotFoundError } from '@/errors'

interface Order {
  id: string
  user: string
  delivery?: string
  restaurant: string
}

const ordersList: Order[] = [
  { id: '1', user: '1', delivery: '1', restaurant: '1' },
  { id: '2', user: '2', delivery: '2', restaurant: '2' },
  { id: '3', user: '3', delivery: '3', restaurant: '3' },
  { id: '4', user: '4', delivery: '4', restaurant: '4' },
  { id: '5', user: '5', delivery: '5', restaurant: '5' },
  { id: '6', user: '6', delivery: '6', restaurant: '6' },
]

export async function getOrderDetails(orderId: string): Promise<Order> {
  const result = ordersList.find(order => order.id === orderId)

  if (!result) {
    return Promise.reject(new NotFoundError('Order'))
  }

  return Promise.resolve(result)
}
