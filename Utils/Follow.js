const ObjectId = require('mongodb').ObjectId;

function validateMongoDbUserId(userId){

    if(!userId)
    {
        return false;
    }
    if(!ObjectId.isValid(userId))
    {
        return false;
    }

    return true;

}

module.exports= {validateMongoDbUserId}