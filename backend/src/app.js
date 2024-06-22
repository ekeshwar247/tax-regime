import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()  

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: "true", limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRoutes from './routes/user.route.js'
app.use('/users', userRoutes)

import uploadRoutes from './routes/upload.route.js'
app.use('/upload', uploadRoutes)


export {app}