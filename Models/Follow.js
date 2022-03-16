const FollowSchema = require('../Schemas/Follow')

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

module.exports ={followUser}