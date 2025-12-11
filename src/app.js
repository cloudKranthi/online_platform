const express = require('express');
const app = express();
const cookieparser = require('cookie-parser')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT ||8000
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
const userRoutes = require('./routes/user.routes')
  
app.use("/api/v1/users",userRoutes)

module.exports = app;