export const asyncHandler = (asyFunc) =>
    async(req,res,next)=>{
        try{
            await asyFunc(req,res,next)
        }
        catch(error){
            console.log(error)
        }
    }