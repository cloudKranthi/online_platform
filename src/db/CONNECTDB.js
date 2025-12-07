

const mongoose = require('mongoose');
require('dotenv').config();
const CONNECTDB = async ()=>{
    try{
   await  mongoose.connect(`${process.env.MONGO_DB_URI}`);
   console.log(`MONGO DB CONNECTED`);   
}catch(error){
    console.log(error);
}
}
module.exports = CONNECTDB;