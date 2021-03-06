const validator = require('validator')


function cleanUpAndValidate({ username, password, phone, email, name }) {
    return new Promise((resolve, reject) => {

        if (!(name && username && email && password)) {
            return reject("Missing parameters");
        }
        if (!validator.isEmail(email)) {
            return reject("Invalid email")
        }
        if (validator.isEmail(username)) {
            return reject("username can't be the email")
        }
        if (phone && phone.length !== 10) {
            return reject("Invalid phone")
        }
        if (username.length < 3) {
            return reject("Username too short")
        }
        if (username.length > 40) {
            return reject("username too long")
        }
        if (password.length < 6) {
            return reject("password too short");
        }
        if (password.length > 30) {
            return reject("password too long")
        }
        if (!validator.isAlphanumeric(password)) {
            return reject("password should be alphanumeric")
        }
        if (name.length > 200) {
            return reject("name length too long")
        }
        resolve()
    })
}

const isAuth =(req,res,next)=>{

     if(req.session.isAuth)
     {
         next();
     }
     else{
         return res.send({
             status:404,
             message:"Invalid user session, please log in"
         })
     }
}
module.exports = { cleanUpAndValidate,isAuth }