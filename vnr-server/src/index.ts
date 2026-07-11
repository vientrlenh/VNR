import 'dotenv/config'
import express, { type Request, type Response} from 'express'
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
import { createServer } from 'http'
import { initSocket } from './lib/socket.js'

const app = express()
const PORT = process.env.PORT || 3000
const httpServer = createServer(app)

initSocket(httpServer)

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send({
        status: 'OK'
    })
})

app.use('/auth', authRoutes)

httpServer.listen(PORT, () => {
    console.log(`Server started at Port: ${PORT}`)
})