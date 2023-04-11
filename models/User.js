const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true},
    phone:{type:Number},
    password:{type:String,required:true},
    profilepic:{type:String},
    isPrivate:{type:Boolean,required:true,default:false},
    isAdmin:{type:Boolean,default:false}
},{timestamps:true});
module.exports = mongoose.model('User',UserSchema);