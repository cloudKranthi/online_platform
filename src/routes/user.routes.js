const express = require('express');
const router = express.Router();

const registerUser = require('../controllers/user.controller'); // ✅ fixed file name
const upload = require('../middleware/multer.middleware');       // ✅ correct

router.post(
    "/register",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "CoverImage", maxCount: 1 }
    ]),
    registerUser
);

module.exports = router;
