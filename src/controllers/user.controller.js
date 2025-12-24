const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user.models");
const uploadImage = require("../uploadimage");
const fs = require("fs");
const ApiResponse = require('../utils/ApiResponse');
const { none } = require("../middleware/multer.middleware");
const { default: mongoose } = require("mongoose");
const generateaccessandrefreshtokens = async (userId)=>{
    try{
    const user = await User.findById(userId)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
    user.refreshToken= refreshToken
    await user.save({validateBeforeSave:false})
    return {accessToken,refreshToken}

    }
    catch(err)
    {
        throw new Error('error while generating access and referesh token')
    }
}

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;

  // Basic validation
  if (!username || !fullname || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "username, fullname, email and password are required",
    });
  }

  console.log("FILES:", req.files);
  console.log("BODY:", req.body);

  let avatarUrl = null;
  let coverUrl = null;

  // --- Avatar Upload ---
  if (req.files?.avatar?.[0]) {
    const localPath = req.files.avatar[0].path;

    avatarUrl = await uploadImage(localPath);
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);

    // 🔥 IMPORTANT FIX
    if (!avatarUrl) {
      return res.status(400).json({
        success: false,
        message: "Avatar upload failed — Cloudinary returned null",
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Avatar file is required",
    });
  }

  // --- Cover Image Upload (optional) ---
  if (req.files?.CoverImage?.[0]) {
    const localPath = req.files.CoverImage[0].path;

    coverUrl = await uploadImage(localPath);
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
  }

  // Create user
  const user = new User({
    username,
    fullname,
    email,
    password,
    avatar: avatarUrl, // now always valid
    coverImage: coverUrl,
  });

  await user.save();

  res.status(201).json({
    success: true,
    data: user,
  });
});
const loginUser = asyncHandler(async (req, res) => {
  /*  1.take  username and password from req.body
       2.check if user is present if not generate error
       3.check password if not correct give error
       4. if password correct generate acces token and refresh token
       5.send cookies
     */

  const { username, password, email } = req.body;
  if (!username && !email) {
    return res.status(400).json({
      success: " false",
      message: " send eitheir username or email ",
    });
  }
  const user=await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user){
    return res.status(400).json({
      success: "false",
      message: " user is not registered",
    });
  }
const isPasswordCorrect = await user.isPasswordCorrect(password)
 if(!isPasswordCorrect){
    throw new Error('password is not correct ')
 }
 const {accessToken,refreshToken}=await generateaccessandrefreshtokens(user._id)
 const loggedInUser =await User.findById(user._id).select("-password -refreshToken")
 const options =
{
    httpOnly:true,
    secure:true
}
return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
new ApiResponse(200,
    {
      user: loggedInUser,accessToken,refreshToken
    },"User Logged In sucessfully"
)
)
})
const logoutUser = asyncHandler(async (req,res)=>{
    await  User.findByIdAndUpdate(
   req.user._id,{
    $set: {
        refreshToken:undefined
    }
   },
 {
        new:true
    }
 )
 const options = {
    httpOnly:true,
    sameSite:none
 }
 return res.status(200).clearCookie("accessToken",options)
 .clearCookie(refreshToken,options)
 .json(new ApiResponse(200,{},"User Logged Out"))
 
})
const changeCurrentPassword = asyncHabdler(async (req,res)=>{
  const {oldPassword,newPassword,conformPassword}=req.body;
  if(!(newPassword === conformPassword)){
    throw new Error('new password and conform password are not same')
  }
 const user = await User.findById(req.user?._id)
 const isPasswordCorrect = user.isPasswordCorrect(oldPassword)
 if(!isPasswordCorrect){
  throw new Error('Invalid old password')
 }
 user.password = conformPassword
  await user.save({validateBeforeSave:false})
  return res.status(200).json(new ApiResponse(200,{},"Password changed"))
})
const getCurrentUser = asyncHandler(async(req,res)=>{
  return res.status(200).json(200,req.user,"Current user fetched succesfully")
})
const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {fullname,email}= req.body
 if(!fullname || !email){
  throw new Error("All feilds are required")
 }
 const user = await User.findByIdAndUpdate(req.user?.id,{
  $set:{
    fullName,
    email:email,

  }
 },{new:true}).select("-password")
 return res.status(200).json(new ApiResponse(200,"Account Details Successfully updated"))
})
const updateUserAvatar = asyncHandler(async(req,res)=>{
  const avatarLocalPath = req.file?.path
  if(!avatarLocalPath){
    throw new Error("Avatar is missing")
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  if(!avatar.url){
    throw new Error('Error while uploading on cloudinary')
  }
  await User.findByIdAndUpdate(req.user?._id
  ,{
    $set:{
      avatar:avatar.url
    }
  },{new:true}
  
).select("-password")
return res.json(new ApiResponse(200,'Avatar updated succesfully'))
})
const updateUserCoverImage = asyncHandler(async (req,res)=>{
  const coverImageLocalPath = req.file?._id;
    if(!coverImageLocalPath){
    throw new Error("COVER Image is missing")
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage.url){
    throw new Error('Error while uploading on cloudinary')
  }
  await User.findByIdAndUpdate(req.user?._id,{
    $set:{
      coverImage:coverImage.coverUrl
    }
  },{new:true}).select("-Password")
  return res.status(200).json(new ApiResponse(200,'cover image updated succesfully '))
})
const getUserChannelProfile = asyncHandler(async(req,res)=>{
  const {username} = req.params
  const channel = await User.aggregate([
    {
      $match:{
        username:username
      }
    },
    {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"
      }
    },
    {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subscribedTo"
      }
    },
    {
      $addFields:{
        subscribersCount:{$size:"$subscribers"},
        channelsSubscribedToCount:{$size:"$subscribedTo"},
        isSubscribed:{
          $cond:{
            if:{$in:[req.user?._id,"$subscribers.subscriber"]},
            then:true,
            else:false
          }
        }
      }
    },
    {
      $project:{
        fullName:1,
        username:1,
        subscribersCount:1,
        channelsSubscribedToCount:1,
        isSubscribed:1,
        coverimage:1,
        email:1
      }
    }
  ])
  if(!channel?.length){
    throw new Error("Channel does not exist")
  }
  return res.status(200).json(new ApiResponse(200,channel[0],"Channel profile fetched successfully"))
})
const getwatchHistory = asyncHandler(async(req,res)=>{
  const user = await User.aggregate([
    {
      $match:{
        _id:new mongoose.Types.ObjectId(req.user?._id)
      }
    },{
      $lookup:{
        from:"videos",
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHistory",
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"_id",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    fullname:1,
                    username:1,
                    avatar:1
                  }
                }
              ]
            }
          },
          {$addFields:{
            owner:{
              $first:"$owner"
            }
          }}
        ]
      }
    }
  ])
  return res.status(200).json(new ApiResponse(200,user[0].watchHistory,"Watch History Fetched Successfully"))
})
module.exports = {registerUser,loginUser,logoutUser,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage,getUserChannelProfile};
