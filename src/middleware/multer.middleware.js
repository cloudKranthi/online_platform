const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Absolute path to folder where files will be saved
const uploadDir = path.resolve(__dirname, '../uploadImage');

// Create folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created folder:', uploadDir);
} else {
    console.log('Folder exists:', uploadDir);
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// Multer instance
const upload = multer({ storage });

module.exports = upload;
