const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/user.models');
const uploadImage = require('../uploadimage');
const fs = require('fs');

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullname, email, password } = req.body;

    // Basic validation
    if (!username || !fullname || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "username, fullname, email and password are required"
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
                message: "Avatar upload failed — Cloudinary returned null"
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Avatar file is required"
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
        avatar: avatarUrl,      // now always valid
        coverImage: coverUrl
    });

    await user.save();

    res.status(201).json({
        success: true,
        data: user
    });
});

module.exports = registerUser;
