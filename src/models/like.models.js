const mongoose = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2')
const likeSchema = new mongoose.Schema({
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    tweet:{
              type:mongoose.Schema.Types.ObjectId,
        ref:"Tweet"
    }
},{timestamps:true})
likeSchema.plugin(mongooseAggregatePaginate)
module.exports = mongoose.model("Like",likeSchema)