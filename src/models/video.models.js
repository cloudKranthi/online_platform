const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2')
const videomodel = new mongoose.model({
videoFile:{
    type:String,
    required:true
},
thumbnail:{
        type:String,
    required:true
},
title:{
        type:String,
    required:true
},
description:{
           type:String,
    required:true 
},
duration:{
            type:Number,
    required:true
},
veiws:{
type:Number,
default:0

},
isPublished:{
    type:true,
    default:true
},
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}
},{timestamps:true});
videomodel.plugin(mongooseAggregatePipeline)

module.export = mongoose.model('Video',videomodel)