const mongoose=require('mongoose')
const PostSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    comment:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]

},{
    timestamps:true
})

const post=mongoose.model('post',PostSchema);
module.exports=post