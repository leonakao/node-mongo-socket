import http from 'http'
import app from './app'
import ChatService from './chat'

const server = http.createServer(app)

ChatService.init(server)

server.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('🚀 Server started on port 3333')
})
