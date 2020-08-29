import http from 'http'
import socketio from 'socket.io'
import app from './app'

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', socket => {
  // eslint-disable-next-line no-console
  console.log('User connected', socket)
})

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('🚀 Server started on port 3333')
})
