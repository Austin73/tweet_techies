const express = require('express')
const { validateMongoDbUserId } = require('../Utils/Follow')
const followRouter = express.Router();
const User = require('../Models/User')
const { followUser } = require('../Models/Follow')
followRouter.post('follow-user', async (req, res) => {

    const followerUserId = req.session.user.userId;
    const { followingUserId } = req.body;


    // check if Ids is valid

    if (!validateMongoDbUserId(followingUserId)) {
        return res.send({
            status: 404,
            message: "Invalid user id"
        })
    }

   if(followerUserId === followingUserId)
   {
       return res.send({
           status:400,
           message:"You can't follow your self"
       })
   }
    // check if followingUserId exist in database 

    try {
        const userDb = await User.verifyUserIdExist({ followerUserId })
        if (!userDb) {
            return res.send({
                status: 404,
                message: "This user doesn't exist"
            })
        }

        const followDb = await followUser({ followerUserId, followingUserId })
        return res.send({
            status:200,
            message:"User successfully followed",
            data:followDb
        })
    } catch (error) {
        return res.send({
            status: 400,
            message: error.message
        })
    }

    // is the User currently following the user if yes then throw error
    // create an entry in db






})



module.exports = followRouter;