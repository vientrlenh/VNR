import express, { type Request, type Response} from 'express'
import authRoutes from './routes/authRoutes.js'


const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send({
        status: 'OK'
    })
})

app.use('/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server started at Port: ${PORT}`)
})