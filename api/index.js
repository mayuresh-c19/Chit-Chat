const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');

dotenv.config();
mongoose.connect(process.env.MONGO_URL);
const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.get('/', (req, res) => {
  res.json('Hello World');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try{
        const createdUser = await User.create({ username, password });
        jwt.sign({userid: createdUser._id}, jwtSecret, {}, (err, token) => {
            if (err) throw(err);
            res.cookie('token', token).status(201).json({
                _id: createdUser._id,
            });
        });
    }catch(err){
        if(err) throw(err);
        res.status(500).json('Error');
    }
    
});

app.listen(4000)
