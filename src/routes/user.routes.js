const express = require('express');
const router = express.Router();
const {loginUser,logoutUser,registerUser, changeCurrentPassword,getwatchHistory, getCurrentUser, updateAccountDetails, getUserChannelProfile} = require('../controllers/user.controller') // ✅ fixed file name
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
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/watch-history").get(verifyJWT, getwatchHistory)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/update-cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/channel/:username").get(verifyJWT,getUserChannelProfile)

module.exports = router;
