const express = require('express');
const { type } = require('express/lib/response');
const tweetsRouter = express.Router();
const tweetsSchema = require('../Schemas/Tweets')
const Tweeets = require('../Models/Tweet')

tweetsRouter.post('/create-tweet',async (req, res) => {

    const { title, bodyText } = req.body;
    const { userId } = req.session.user;

    if (!title || !bodyText || !userId) {
        return res.send
            ({
                status: 401,
                message: "Parameters missing"
            })
    }
    if (typeof (title) != 'string' || typeof (bodyText) != 'string') {
        return res.send({
            status: 401,
            message: "Title and bodytext should be only text"
        })
    }
    if (title.length > 200 || bodyText.length > 1000) {
        return res.send({
            status: 402,
            message: "Title and bodyText too long "
        })
    }
    const creationDateTime = new Date();
    const tweet = new Tweeets({ creationDateTime, title, bodyText, userId });
    
    try {
        const dbTweet= await tweet.createTweet();
    } catch (error) {
        return res.send({
            status:402,
            message:error
        })
    }


})






module.exports = tweetsRouter