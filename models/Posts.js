const mongoose=require('mongoose');
const PostSchema=new mongoose.Schema({
    id:{type:String, required:true,unique:true},
     posts:[{
        postid:String,
        postimg:String,
        posttitle:String,
        comments:[{mycomment:String}]
     }]
    
},{timestamps:true});
module.exports=mongoose.model('Post',PostSchema);