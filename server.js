import 'dotenv/config'
import express from "express";
import { errorHandler } from './middlewares/errorMiddleware.js'
import bankRoutes from './routes/bankRoutes.js'
import cors from 'cors'
const app = express()
// cors middleware
app.use(cors())
app.use(express.json())

// Bank Routes
app.use('/api/v1/bank', bankRoutes)

//Error handling Middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})