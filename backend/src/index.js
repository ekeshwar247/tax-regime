import {app} from './app.js'
import dotenv from 'dotenv'
import {connection} from './db/connect.js'

dotenv.config({
    path:'./.env'
})

connection()

app.listen(process.env.PORT, ()=>{
    console.log('Server is listening on PORT 7000')
})
