
const tweetsSchema = require('../Schemas/Tweets')



class Tweeets {

    title;
    bodyText;
    userId;
    creationDateTime;
    constructor({ title, bodyText, userId, creationDateTime }) {
        this.title = title,
            this.bodyText = bodyText,
            this.userId = userId,
            this.creationDateTime = creationDateTime
    }

    createTweets({ creationDateTime, title, bodyText, userId }) {
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
}

module.exports = Tweeets