import mongoose from 'mongoose'

export const connection = async() =>{
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log('Database Connected Successfully')
    }
    catch(error) {
        console.log(error)
    }
}