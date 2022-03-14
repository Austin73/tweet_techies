
const tweetsSchema = require('../Schemas/Tweets')
class Tweeets {

    title;
    bodyText;
    userId;
    creationDateTime;
    tweetId;

    constructor({ title, bodyText, userId, creationDateTime, tweetId }) {
        this.title = title,
            this.bodyText = bodyText,
            this.userId = userId,
            this.creationDateTime = creationDateTime,
            this.tweetId = this.tweetId
    }

    createTweets() {
        return new Promise(async (resolve, reject) => {
            this.title.trim();
            this.bodyText.trim();

            const tweet = new tweetsSchema({
                title: this.title,
                bodyText: this.bodyText,
                userId: this.userId,
                creationDateTime: this.creationDateTime
            })

            try {
                const dbTweet = await tweet.save();
                resolve(dbTweet)
            } catch (error) {

                return reject(error)
            }
        })
    }

    static getTweets({ offset }) {
        // first sort the record based on time and then apply paginatino
        return new Promise(async (resolve, reject) => {

            const tweetLimit = parseInt(process.env.TWEETSLIMIT); // parse the tweets limit present in .env file
            try {
                const dbTweets = await tweetsSchema.aggregate(
                    [
                        { $sort: { "creationDateTime": -1 } }, // sort in descending order of time
                        {
                            $facet: {
                                data:
                                    [
                                        { "$skip": parseInt(offset) },
                                        { "$limit": tweetLimit }
                                    ]
                            }
                        }
                    ]
                );

                resolve(dbTweets[0].data)
            } catch (error) {
                return reject(error);
            }

        })
    }

    static getMyTweets({ offset, userId }) {
        // first sort the record based on time and then apply paginatino
        return new Promise(async (resolve, reject) => {

            const tweetLimit = parseInt(process.env.TWEETSLIMIT); // parse the tweets limit present in .env file
            try {
                const dbTweets = await tweetsSchema.aggregate(
                    [
                        { $match: { username: userId } },
                        { $sort: { "creationDateTime": -1 } }, // sort in descending order of time
                        {
                            $facet: {
                                data:
                                    [
                                        { "$skip": parseInt(offset) },
                                        { "$limit": tweetLimit }
                                    ]
                            }
                        }
                    ]
                );

                resolve(dbTweets[0].data)
            } catch (error) {
                return reject(error);
            }

        })
    }

    getTweetDataFromTweetId() {

        return new Promise(async (resolve, reject) => {
            try {
                const tweetData = await tweetsSchema.findOne({ _id: this.tweetId })
                resolve(tweetData)
            } catch (error) {
                return reject(error)
            }
        })
    }

    editTweets() {
        return new Promise(async (resolve, reject) => {

            let newTweetData = {};
            if (this.title) {
                newTweetData.title = this.title
            }
            if (this.bodyText) {
                newTweetData.bodyText = this.bodyText
            }
            try {

                const oldTweetData = await tweetsSchema.findOneAndUpdate({ _id: this.tweetId }, newTweetData)
                resolve(oldTweetData)
            } catch (error) {
                return reject(error)

            }
        })
    }
}

module.exports = Tweeets