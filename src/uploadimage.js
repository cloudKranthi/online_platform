const cloudinary = require('./utils/cloudinary');

const fs = require('fs');

async function uploadImage(localFilePath) {
    try {
        const results = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        return results.secure_url;
    } catch (error) {
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        console.log(error)
        return null;
    }
}

module.exports = uploadImage;
