const mongoose = require('mongoose');
const subscriptionSchema = new mongoose.Schema({
subscriber:{
    type:Schema.Types.ObjectId,
    ref:"User"
},
channel:{
   type:Schema.Types.ObjectId,
   ref: "User"
}
},{timestamps:true})
module.exports = mongoose.model('Subscription',subscriptionSchema)