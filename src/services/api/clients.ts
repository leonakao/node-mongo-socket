interface Client {
  id: string | number
  name: string
}

const clientsList: Client[] = [
  { id: 1, name: 'Client 1' },
  { id: 2, name: 'Client 2' },
  { id: 3, name: 'Client 3' },
  { id: 4, name: 'Client 4' },
  { id: 5, name: 'Client 5' },
  { id: 6, name: 'Client 6' },
]

export async function getClient(clientId: string | number): Promise<Client> {
  const result = clientsList.find(client => client.id === clientId)

  if (!result) {
    return Promise.reject(new Error('Client not found'))
  }

  return Promise.resolve(result)
}
