const express = require('express');
const { cleanUpAndValidate } = require('../Utils/Auth')
const authRouter = express.Router();
const User = require('../Models/User');

/// We can JOI library for data validation
// Don't pass req ,and res object to any function of model or anywhere, use this in only controller
// req and res is just json object
authRouter.post('/login',async (req, res) => {

    const { loginId, password } = req.body;
    if (!loginId || !password) {
        return res.send(
            {
                status: 400,
                "message": "Invalid data"
            }
        )
    }
    try {
      const dbUser= await User.loginUser({loginId,password})

      req.session.isAuth= true;
      req.session.user={
          email :dbUser.email,
          username: dbUser.username,
          name: dbUser.name,
          userId:dbUser._id
      }

     return res.send({
          status: 200,
          message:"Login successfull",
          data : dbUser
      })
    } catch (error) {
         return res.send({
             status: 401,
             message:error
         })
    }
})


authRouter.post('/register', async (req, res) => {
    const { username, email, name, password, phone } = req.body


    //validate data for error
    try {
        await cleanUpAndValidate({ username, email, name, password, phone });
    } catch (error) {
        return res.send({
            status: 400,
            error: error
        })
    }

    // save user in db
    // verify if it is existing user
    // dont include req.body in response as it has password also
    try {
        await User.verifyUsernameAndEmailExists({ username, email })
    } catch (error) {

        return res.send({
            status: 401,
            error: error
            // data:req.body
        })
    }



    //create and save user
    const user = new User({ username, password, phone, email, name })
    try {

        const dbUser = await user.registerUser();
        return res.send({
            status: 200,
            message: "User created successfully",

        })

    } catch (error) {
        return res.send({
            status: 400,
            message: "Database error ,Please try again",
            error: error.message
        })
    }

})



authRouter.post('/logout', (req, res) => {

    if(!req.session.isAuth)
    {
        return res.send({
            status:401,
            message:"Invalid session"
        })
    }
    const userData= req.session.user
    
    req.session.destroy(err=>{
        if(err)
        {
           return res.send({
                status: 401,
                error:err.message,
                message:"Logout failed, please try again"
            })
        }

        return res.send({
            status:200,
            message:"Logout successful",
            data: userData
        })
    })
})


module.exports = authRouter