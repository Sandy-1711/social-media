const mongoose=require('mongoose');
const FollowerSchema=new mongoose.Schema({
    username:{type:String,required:true},
    id:{type:String,required:true},
    followers:[
        
        
    ]
},{timestamps:true})
module.exports=new mongoose.model('Follower',FollowerSchema);