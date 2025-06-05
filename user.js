const express=require("express");
const router=express.Router();
const wrapAsync=require("../util/wrapAsync.js");
const User=require("../models/user.js");
const { array } = require("joi");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
});


router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const user1=new User({ username,email});
        let RegisteredUser= await User.register(user1,password); 
       

        req.flash("super","User is Registered Succesfully");
        res.redirect("/listings");
    }
    catch(er){
        req.flash("error",er.message);
        res.redirect("/signup");
    }
}));


router.get("/login", (req,res)=>{
    res.render("user/login.ejs");
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        next(err);
   });
   req.flash("super","you are logged out");
   res.redirect("/listings");
});

router.post("/login", passport.authenticate("local",
    { failureRedirect:"/login", failureFlash:true})
    ,async(req,res)=>{
    req.flash("super","You are logged in sucessfully!");
    res.redirect("/listings");
});

module.exports=router;


