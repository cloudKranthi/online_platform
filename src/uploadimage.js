const cloudinary = require('./utils/cloudinary');
async function uploadImage(localFilePath){
    try{
     const results = await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
     })
    console.log(" URI:",results.secure_url);
    return results.secure_url;


    }catch(error){
   fs.unlinkSync(localFilePath)
   return null
    }
    
}
module.exports = uploadImage;