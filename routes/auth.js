const { verify } = require('jsonwebtoken');
const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Follower = require('../models/Followers');
const Following = require('../models/Following');
const Post = require('../models/Posts');
const cryptoJS = require('crypto-js');
router.post('/register', async function (req, res) {
    const newuser = new User({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC.toString()),
        profilepic: req.body.profilepic,
        isPrivate: req.body.isPrivate,
        isAdmin: req.body.isAdmin,
    });

    try {
        const savedUser = await newuser.save();
        res.status(201).json(savedUser);
        const defaultFollower = new Follower({
            username: savedUser.username,
            id: savedUser._id,
            followers: []
        })
        await defaultFollower.save();

        const defaultFollowing = new Following({
            username: savedUser.username,
            id: savedUser._id,
            following: []
        })
        await defaultFollowing.save();

        const defaultPosts = new Post({
            id: savedUser._id,
            posts: [{
                comments: []
            }]
        })
        await defaultPosts.save();
    }
    catch (err) {
        res.status(500).json(err);
    }
});
router.post('/login', async function (req, res) {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(401).json("User not found");
        }
        const hashedpassword = cryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const password = hashedpassword.toString(cryptoJS.enc.Utf8)
        if (password === req.body.password) {
            const token = jwt.sign({ username: user.username, id: user._id, isAdmin: user.isAdmin, isPrivate: user.isPrivate }, process.env.JWT_SEC, { expiresIn: '1d' });
            const { password, ...others } = user._doc;
            res.status(200).json({ ...others, token });
        }
        else {
            res.status(401).json("Wrong password");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})
module.exports = router;