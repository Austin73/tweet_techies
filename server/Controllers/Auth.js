const express= require('express')

const authRouter= express.Router();


authRouter.post('/login',(req,res)=>{

})


authRouter.post('/register   ',(req,res)=>{
    const {username,email,name,password,phone} = req.body
 cleanUpAndValidate({username,email,name,password,phone});
 
})



authRouter.post('/logout',(req,res)=>{
    
})


module.exports= authRouter