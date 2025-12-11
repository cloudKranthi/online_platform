const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken")
const User = require("../models/user.models")
const verifyJWT = asyncHandler(async (req,res,next)=>{
try{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    if(!token){
                throw new Error("Unauthorized request")
    }
    const decodedToken  = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if(!user){
                throw new Error("Invalid Access Token")
    }
    req.user = user;
    next();
}catch(error){
  throw new Error(error?.message ||"Invalid Token")
}
}
)
module.exports = verifyJWT;