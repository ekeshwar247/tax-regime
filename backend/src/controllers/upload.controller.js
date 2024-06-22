import { Upload } from "../models/upload.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const uploadDocuments = asyncHandler(async(req,res)=>{

    const user = req.user

    if(!user)
        throw new ApiError(460,"User not Found")

    const fileLocalPath = req.files.file[0].path

    if(!fileLocalPath) 
        throw new ApiError(400,"Local Path not Found")


    const cloudPath = await uploadToCloudinary(fileLocalPath)
    
    if(!cloudPath)
        throw new ApiError(500,"File couldn't be uploaded on cloudinary")

    const uploading = await Upload.create({
        file: cloudPath.url,
        owner: user,
        ownerName : user.fullname,
    })

    return res.status(201).json({
        message : "File uploaded successfully",
        file : uploading.file,
        owner : uploading.owner,
        ownerName : user.fullname,
    })
    
})

const getDocuments = asyncHandler(async(req,res)=>{
    const user = req.user
    const {startDate, endDate} = req.body;

    console.log(req.body)

    if(startDate=='none' || endDate=='none') {
        return res.status(400).json({message:'Both dates not recieved'})
    }

    const submissions = await Upload.find({ 
        createdAt: {
              $gte: new Date(new Date(startDate).setHours(0o0, 0o0, 0o0)),
              $lt: new Date(new Date(endDate).setHours(23, 59, 59))
               }
        }).sort({ createdAt: 'asc'})  

    // const submissions = Upload.find({
    //     createdAt:{
    //     $gte: startDate,
    //     $lt: endDate
    // }
    // })
      
        if(!submissions)
        {
            return res.status(500).json({message:'Couldn\'t retrieve submissions'})
        }

        return res.status(200).json({
            message: 'submissions retrieved successfully',
            submissions: submissions
        })
        

    
})

export {uploadDocuments, getDocuments}