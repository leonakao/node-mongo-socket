interface Order {
  id: string | number
  client: string | number
  motoBoy: string | number
  restaurant: string | number
}

const ordersList: Order[] = [
  { id: 1, client: 1, motoBoy: 1, restaurant: 1 },
  { id: 2, client: 1, motoBoy: 2, restaurant: 2 },
  { id: 3, client: 1, motoBoy: 3, restaurant: 3 },
  { id: 4, client: 1, motoBoy: 4, restaurant: 4 },
  { id: 5, client: 1, motoBoy: 5, restaurant: 5 },
  { id: 6, client: 1, motoBoy: 6, restaurant: 6 },
]

export async function getOrderDetails(orderId: string): Promise<Order> {
  const result = ordersList.find(order => order.id === orderId)

  if (!result) {
    return Promise.reject(new Error('Order not found'))
  }

  return Promise.resolve(result)
}
