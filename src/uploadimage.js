const cloudinary = require('./utils/cloudinary');
async function uploadImage(localFilePath){
    try{
     const results = await cloudinary.uploader.upload(localFilePath)
    console.log("IMAGE URI:",results.secure_url);
    return results.secure_url;


    }catch(error){
    console.error("cloudinary upload error ",error)
    }
    
}
module.exports = uploadImage;