const mongoose = require('mongoose');
const FollowingSchema = new mongoose.Schema({
    username:{type: String, required: true},
    id: { type: String, required: true },
    following:[]
},
{timestamps:true})
module.exports = new mongoose.model('Following', FollowingSchema);