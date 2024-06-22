import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

export const uploadToCloudinary = async(localPath) =>{
    try{

        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET
          });

        if(!localPath) return null
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type : "auto" //which type of file is being upload.... auto means that the cloudinary should itself detect the file
        })
        //file uploaded
        console.log("file has been uploaded on cloudinary: "+response.url)
        return response
    }
    catch(error){
          
        console.log(error)
        return null
    }
    finally{
        fs.unlinkSync(localPath) //Remove the locally saved file
    }
}