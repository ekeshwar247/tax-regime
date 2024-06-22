import {User} from '../models/user.model.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req,res,next)=>{

    const {userId, username, fullname, email, phone, password} = req.body

    if(!userId || !username || !fullname || !email || !phone || !password)
        return res.status(400).json({message:'Enter all fields'})

    const existing = await User.findOne(
        {
            $or : [{username},{email},{phone},{userId}]
        }
    )

    if(existing)
    {
        return res.status(400).json({message:'User with the same email/username/phone number/userId exists'})
    }

    const user = await User.create({
        userId, username, fullname, phone, email, password
    })
    return res.status(201).json({
        message : 'User created successfully!!!',
        username, userId, fullname
    })
})
const loginUser = asyncHandler( async(req,res)=>{
    const {username,password} = req.body;
    const user = await User.findOne(
        {
            $or : [{username}]
        }
    )
    if(!user)
        return res.status(400).json({message:'User does not exist'})

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid)
        return res.status(400).json({message:'Username/Password incorrect'})

    // console.log(user)
    
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // console.log(accessToken)

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    const options = {
        // httpOnly: true,
        // secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        {
            message: "Logged in Successfully",
            username: user.username,
            refreshToken: user.refreshToken
        }
    )
    

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({message:req.user.username+" logged out successfully"})
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            // httpOnly: true,
            // secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const giveUser = (req,res)=>{
    return res.status(220).json(req.user)
}


export {registerUser,loginUser,logoutUser,refreshAccessToken,giveUser}