const express = require('express')
const { validateMongoDbUserId } = require('../Utils/Follow')
const followRouter = express.Router();
const User = require('../Models/User')
const {isAuth} = require('../Utils/Auth')
const { followUser,followingList } = require('../Models/Follow')
followRouter.post('follow-user',isAuth, async (req, res) => {

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

followRouter.get('/following-list/:userId',async (req,res)=>{

    const userId= req.params;
    const offset= req.query
    if(!validateMongoDbUserId({userId})){
          res.send({
              status:400,
              message:"UserId not valid"
          })
    }


//User -100M in our website

//Follow= - 1B rows (100*10K)
//  searcching in follow table wiill be costly,so we should ccheck if particular user exist



try {
    const userDb = await User.verifyUserIdExist( userId )
    if (!userDb) {
        return res.send({
            status: 404,
            message: "This user doesn't exist"
        })
    }

    const followingUserDetails = await followingList({followerUserId:userId,offset})
    return res.send({
        status:200,
        message:"Find all followers ",
        data:followingUserDetails
    })
} catch (error) {
    return res.send({
        status: 400,
        message: error.message
    })
}

})

module.exports = followRouter;

//User -100M in our website

//Follow= - 1B rows (100*10K)
//  searcching in follow table wiill be costly,so we should ccheck if particular user exist