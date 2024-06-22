import mongoose from 'mongoose'

const uploadSchema = mongoose.Schema({
    file:
    {
        type : String, //Cloudinary
        required : true
    },
    owner:
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    ownerName:
    {
        type:String,
    }
},
{
    timestamps : true
})

export const Upload = mongoose.model('Upload', uploadSchema)