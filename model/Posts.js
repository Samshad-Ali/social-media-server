const mongoose = require('mongoose')

const PostSchema  = mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
         // this means Id of the user that is document of 'user' collection because it give the reference
        ref:'user',
        // ref -> it means that this user_id is in user collection so that it go to there and matched it.
        required:true
    },
    image:{
        publicId:String,
        url:String
    },
    caption:{
        type:String,
        required:true
    },
    likes:[
        {
        type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ]
},
{ timestamps: true }
)

module.exports = mongoose.model('post',PostSchema)