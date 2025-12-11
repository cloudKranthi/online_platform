const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user.models");
const uploadImage = require("../uploadimage");
const fs = require("fs");
const ApiResponse = require('../utils/ApiResponse');
const { none } = require("../middleware/multer.middleware");
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
module.exports = {registerUser,loginUser,logoutUser};
