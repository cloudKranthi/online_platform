const express = require('express');
const router = express.Router();
const {loginUser,logoutUser,registerUser,refreshAccessToken} = require('../controllers/user.controller') // ✅ fixed file name
const upload = require('../middleware/multer.middleware');       // ✅ correct
const verifyJWT = require('../middleware/auth.middleware');

router.post(
    "/register",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "CoverImage", maxCount: 1 }
    ]),
    registerUser
);
router.route("/login").post(loginUser)
router.route('/logout').post(verifyJWT,logoutUser)
router.route("/refreshToken").post(refreshAccessToken)
module.exports = router;
