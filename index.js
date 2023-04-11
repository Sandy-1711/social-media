const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');


mongoose.connect(process.env.MONGO_URL).then(function () {
    console.log('connected to mongodb server');
}).catch(function (err) {
    console.log(err);
})

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

app.listen(process.env.PORT || 5000, function () {
    console.log('server is running');
});