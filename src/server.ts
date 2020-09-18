import http from 'http'
import JobsConfig from '@config/jobs'
import app from './app'
import ChatService from './chat'

const server = http.createServer(app)

ChatService.init(server)
JobsConfig()

const port = process.env.PORT || 3333

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server started on port ${port}`)
})
