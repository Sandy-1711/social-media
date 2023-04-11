const { verify } = require('jsonwebtoken');
const router = require('express').Router();
const User = require('../models/User');
const Following = require('../models/Following');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifytoken');
const Followers = require('../models/Followers');
const Post = require('../models/Posts');
const Posts = require('../models/Posts');
//adding following
router.put('/follow/:id/:username', verifyTokenAndAuthorization, async function (req, res) {

    const newfollow = req.body;
    const user = User.findOne({username:req.params.username});
    // console.log(user);
    console.log(newfollow);
    try {

        const savedFollow = await Following.updateOne({ id: req.params.id }, { $addToSet: { "following": newfollow } }, { upsert: true });
        const saved2 = await Followers.updateOne({ id: req.body.id }, { $addToSet: { "followers": { username: req.params.username, id: req.params.id } } }, { upsert: true });
        // const savedFollow = await newfollow.save();
        // Followers.findById(req.body.id).followers.$push(User.findById(req.params.id).username);
        console.log(savedFollow);
        console.log(saved2);
        res.status(200).json(savedFollow);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
//adding follower
// router.post('/followed/:id', verifyTokenAndAuthorization, async function (req, res) {
//     const newfollower = new Followers({
//         username: req.body.username,
//     })
//     try {
//         const savedFollower = Followers.findByIdAndUpdate({ id: req.params.id }, { $push: { newfollower } }, { upsert: true });
//         res.status(200).json(savedFollower);
//     }
//     catch (err) {
//         res.status(500).json(err);
//     }
// })

// getting ids i follow list

router.get('/following/:id', verifyTokenAndAuthorization, async function (req, res) {
    // const foundUser=User.findById(req.params.id);
    try {
        const foundFollowing = await Following.findOne({ id: req.params.id });
        const followinglist = foundFollowing.following;
        const numfollowing=followinglist.length;
        const response={numfollowing,followinglist};
        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
// getting ids that follow me i.e. my followers
router.get('/followers/:id', verifyTokenAndAuthorization, async function (req, res) {
    // const 
    try {
        const foundFollowers = await Followers.findOne({ id: req.params.id });
        const followerlist = foundFollowers.followers;
        const numfollower=followerlist.length;
        const response={numfollower,followerlist};
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})
// posting an image
router.put('/post/:id', verifyTokenAndAuthorization, async function (req, res) {
    const newPost = req.body;
    try {
        const savedPost = await Posts.updateOne({ id: req.params.id }, { $addToSet: { "posts": newPost } },{upsert:true});
        console.log(savedPost)
        res.status(200).json(savedPost);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

// getting a profile
router.get('/:id', verifyTokenAndAuthorization, async function (req, res) {
    const profileid = req.body.id;
    try {
        const profile = await User.findById(profileid);
        // console.log(profile);
        const isfollower = await Followers.find({id:profileid});
        
        // console.log(isfollower[0].followers[0].id);
        if (isfollower[0].followers[0].id) {
            const posts =await Posts.find({id:profileid});
            const postsdetail=posts[0];
            const followers =await Followers.find({id:profileid});
            // console.log(followers);
            const followersdetail=followers[0].followers;
            const following =await Following.find({ id: profileid });
            // console.log(following);
            const followingdetail=following[0].following;

            const { password, ...others } = profile._doc;
            const details = { postsdetail, followersdetail, followingdetail, ...others };
            res.status(200).json(details);
        }
        else {
            
            const { password, ...others } = profile._doc;
            res.status(200).json(...others);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})


//not working// commenting
router.put('/comment/:id/:postid',verifyTokenAndAuthorization,async function(req,res){
    const comment=req.body.comment;
    try{
        console.log(comment);
        const savedComment=await Posts.updateOne({id:req.params.id},{$addToSet:{"comments":comment}},{upsert:true});
        console.log(savedComment);
        res.status(200).json(savedComment);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json(err);
    }
})

router.put('/change/username/:id',verifyTokenAndAuthorization,async function(req,res){
    const newusername=req.body.username;
    try{
        const savedUsername=await User.findByIdAndUpdate(req.params.id,{username:newusername});
        console.log(savedUsername);
        res.status(200).json(savedUsername);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});
router.put('/change/profilephoto/:id',verifyTokenAndAuthorization,async function(req,res){
    const newprofilephoto=req.body.profilephoto;
    try{
        const savedphoto=await User.findByIdAndUpdate(req.params.id,{profilepic:newprofilephoto});
        console.log(savedphoto);
        res.status(200).json(savedphoto);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});
router.delete('/delete/post/:id/:postid',verifyTokenAndAdmin,async function(req,res){
    try{
        const foundPosts=await Posts.find({id:req.params.id});
        function getid(post){
            if(post.postid===req.params.postid)
            {
                return post;
            }
        }
        const foundpost= foundPosts.map(getid)
        if(foundpost){
            const deletedPost=foundpost.delete();
            res.status(200).json(deletedPost);
        }
        else{
            res.status(404).json("Post not found");
        }
    }
    catch(err){
        res.status(500).json(err);
    }
});
router.get('/users/:id',verifyTokenAndAdmin,async function(req,res){
    try{
        const foundUsers=await User.find();
        console.log(foundUsers);
        res.status(200).json(foundUsers);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})
module.exports = router;