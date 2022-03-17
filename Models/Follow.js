const FollowSchema = require('../Schemas/Follow')
const ObjectId = require('mongodb').ObjectId
const UserSchema = require('../Schemas/User')
function followUser({ followingUserId, followerUserId }) {

    return new Promise(async (resolve, reject) => {


        try {
            const followObj = await FollowSchema.findOne({ followerUserId, followingUserId });
            if (followObj) {
                return reject("User already followed")
            }
            const creationDateTime = new Date();
            const follow = new FollowSchema({
                followerUserId,
                followingUserId,
                creationDateTime
            })

            const followDb = await follow.save();
            resolve(followDb)
        } catch (error) {
            reject(error)
        }
    })
}


function followingList({followerUserId, offset}) {

    return new Promise(async (resolve, reject) => {

        try {
            const followingDb = FollowSchema.aggregate([
                {
                    $match: { followerUserId },
                    $project: { followingUserId: 1 },
                    $sort: { creationDateTime: -1 },
                    $facet: { data: [{ $skip: offset }, { $limit: process.env.FOLLOWLIMIT }] }
                }
            ])
            const followingUserId = [];
            followingDb[0].data.forEach(item => {
                followerUserId.push(ObjectId(item))
            });

            // await UserSchema.find({_id:{$in :followerUserId}}) 
            //  Dont use above method as it has security issue, we are sending whole 
            // user information to client
            // dont send email to client



            const followingUserDetails = await UserSchema.aggregate([
                {
                    $match: { _id: { $in: followerUserId } }
                },
                {
                    $project: {
                        username: 1,
                        _id: 1
                    }
                }
            ])

            resolve(followingUserDetails)
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = { followUser, followingList }