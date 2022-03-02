require('dotenv').config();
const express = require('express')
const session = require('express-session')
const mongoDbSession = require('connect-mongodb-session')(session);

//files import

const authRouter = require('./Controllers/Auth')
const app= express()



const store= new mongoDbSession({
    uri :process.env.MONGOURI,
    collection:'tb_session'
})
//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret : process.env.SESSIONSECRETKEY,
    resave:false,
    saveUninitialized: false,
    store:store
}))


// controller

app.use('/auth',authRouter)

app.get('/',(req,res)=>{
    res.send({
        status:200,
        message:"Hello techies"
    })
})




module.exports=app
