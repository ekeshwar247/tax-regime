import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = mongoose.Schema({
    userId : 
    {
        type : Number,
        required : true,
        unique : true,
        trim : true,
        index : true
    },
    username : 
    {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    fullname : 
    {
        type : String,
        required : true,
    },
    email :
    {
        type : String,
        required : true,
        unique : true,
    },
    phone : 
    {
        type : Number,
        required : true,
        unique : true
    },
    password :
    {
        type : String,
        required : true
    },
    refreshToken :
    {
        type : String
    }
},
{
    timestamps : true
})

userSchema.pre('save',
    async function(next)
    {
        if(!this.isModified("password"))
            return next()
        this.password = await bcrypt.hash(this.password,10)
        next()
        
    }
)

userSchema.methods.generateAccessToken = function(){
    // console.log(process.env.ACCESS_TOKEN_SECRET)
    return jwt.sign(
    {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
    // console.log(process.env.ACCESS_TOKEN_SECRET)
}

userSchema.methods.generateRefreshToken = function(){
    // console.log(process.env.REFRESH_TOKEN_SECRET)
    return jwt.sign(
    {
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
    // console.log(process.env.REFRESH_TOKEN_SECRET)
}

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}


export const User = mongoose.model('User', userSchema)