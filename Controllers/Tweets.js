const express = require('express');

const tweetsRouter = express.Router();
const Tweeets = require('../Models/Tweet')
const tweetsSchema = require('../Schemas/Tweets')
tweetsRouter.post('/create-tweet', async (req, res) => {

    const { title, bodyText, userId } = req.body;
    // const { userId } = req.session.user;

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
        const dbTweet = await tweet.createTweets();

        return res.send({
            status: 200,
            message: "Tweet created Successfully"
        })
    } catch (error) {
        return res.send({
            status: 402,
            message: error.message
        })
    }


})

// get all tweets
tweetsRouter.get('/get-tweets', async (req, res) => {

    const offset = req.query.offset | 0;


    let dbTweets = [];
    try {
        dbTweets = await Tweeets.getTweets({ offset })
        return res.send({
            status: 200,
            message: "Find all tweets",
            data: dbTweets
        })
    } catch (error) {
        return res.send({
            status: 401,
            message: error
        })
    }
})

// get my tweets
tweetsRouter.post('/get-my-tweets', async (req, res) => {

    const offset = req.query.offset | 0;
    // const userId=req.session.user.userId;
    const { userId } = req.body

    let dbTweets = [];
    try {
        dbTweets = await Tweeets.getTweets({ offset, userId })
        return res.send({
            status: 200,
            message: "Find all your tweets",
            data: dbTweets
        })
    } catch (error) {
        return res.send({
            status: 401,
            message: error
        })
    }
})



// {
//     "tweet-id":"",
//     "data":{
//        title :"updated title",
//        textBody :"updated body"
//     }
// }

// before editing the tweet ,check if the tweets is owned by use
// req.session.u
tweetsRouter.post('/edit-tweet', async (req, res) => {

    const { title, bodyText } = req.body.data;
    const { tweetId } = req.body
    const userId = req.session.user.userId
    if (!title && !bodyText) {
        return res.send({
            status: 401,
            message: "missing data"

        })
    }

    // check title and bodyText length 
    if (title && typeof (title) !== 'string') {
        return res.send({
            status: 400,
            message: "Title should be only text"
        })
    }

    if (bodyText && typeof (bodyText) !== 'string') {
        return res.send({
            status: 400,
            message: "Bodytext should be only text"
        })
    }

    if (title.length > 200 || bodyText > 1000) {
        return res.send({
            status: 401,
            message: "Title and bodytext too long. Allowed chars for title is 200 and bodytext is 1000."
        })
    }

    const tweet= new Tweeets({title,bodyText,userId,tweetId})
    try {

        // check if the tweet belongs to this user only who is logged in
        const tweetData = await tweet.getTweetDataFromTweetId()
        if (userId !== tweetData.userId) {
            return res.send({
                status: 400,
                message: "Edit not allowed, tweets owned by some other user"
            })
        }
        // verify the creation date time of tweet

        const currentDateTime = Date.now();// return time in milliseconds
        const creationDateTime = new Date(tweetData.creationDateTime);// convert the string date stored in to date
        //javascript supports substraction of date also so,easy
        const diff = (currentDateTime - creationDateTime.getTime()) / (1000 * 60);
        if (diff > 30) {
            return res.send({
                status: 401,
                message: "Edit not allowed after 30 minute of creation"
            })
        }
      // update the tweet 

      const tweetDb= await tweet.editTweets()
     
      return res.send({
          status: 200,
          message:"Edit successful",
          data: tweetDb
      })

    } catch (error) {
        return res.send({
            status: 401,
            error: error
        })
    }



})
module.exports = tweetsRouter