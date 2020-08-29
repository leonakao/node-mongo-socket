import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import bodyParser from 'body-parser'
import routes from './routes'

import './database'

const app = express()

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

app.use(express.json())

app.use(cors())

app.use(routes)

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('🚀 Server started on port 3333')
})
