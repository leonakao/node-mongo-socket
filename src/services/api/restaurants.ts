interface Restaurant {
  id: string | number
  name: string
}

const restaurantsList: Restaurant[] = [
  { id: 1, name: 'Restaurant 1' },
  { id: 2, name: 'Restaurant 2' },
  { id: 3, name: 'Restaurant 3' },
  { id: 4, name: 'Restaurant 4' },
  { id: 5, name: 'Restaurant 5' },
  { id: 6, name: 'Restaurant 6' },
]

export async function getRestaurant(restaurantId): Promise<Restaurant> {
  const result = restaurantsList.find(
    restaurant => restaurantId === restaurant.id,
  )

  if (!result) {
    return Promise.reject(new Error('Restaurant not found'))
  }

  return Promise.resolve(result)
}
