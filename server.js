const mongoose  = require('mongoose');
require('dotenv').config({path:'./env'})
const cors = require('cors');
const app = require('./src/app.js')
const cookieparser = require('cookie-parser')
const PORT = process.env.PORT ||8000
const connectdb = require('./src/db/CONNECTDB.js');
const uploadImage = require('./src/uploadimage.js')
   connectdb()
   .then(()=>{

      })
   .catch((err)=>{
      console.log("mongo db connection failed",err);
   })
 
uploadImage('C:/Users/Shiva/Pictures/Screenshots/protofoliosample.jpg')
uploadImage("C:/Users/Shiva/Pictures/Screenshots/Screenshot 2025-12-07 075352.png")