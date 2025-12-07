const express = require('express');
const app = express();
const cookieparser = require('cookie-parser')
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
module.export = app;