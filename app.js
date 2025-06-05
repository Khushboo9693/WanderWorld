const express=require("express");

const app=express();
const mongoose=require("mongoose");
const path = require('path');
const ejsMate=require("ejs-mate");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");


const sessionOptions={
  secret:"secret",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,//this cookie will last for 7 days
    maxAge:+7*24*60*60*1000,
    httpOnly:true,
  }
}


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(express.urlencoded({ extended: true }));
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));

app.engine('ejs', ejsMate); 
app.use((req,res,next)=>{
  res.locals.sucess=req.flash("super");
  res.locals.error=req.flash("error");
  res.locals.user=req.user;
  next();
});


const ExpressError=require("./util/ExpressError.js");

//routes
const listingRoute=require("./router/listing.js");
const reviewRoute=require("./router/review.js");
const userRouter=require("./router/user.js");

//
app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/",userRouter);


main().then((res)=>{
  console.log("databse is connected");  2
}).catch(err => console.log(err));5

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.listen(8080,()=>{
    console.log("Port is listening");
});

app.get("/",(req,res)=>{
  res.send("request was received");  
});

app.get("/userdemo",async (req,res)=>{
  let newUser=new User({
    email:"pk1962682@gmail.com",
    username:"deadshot",
  });
 let fakeuser= await User.register(newUser,"pass");
  res.send(fakeuser);
});

//middlewares
app.all("*",(req,res,next)=>{

  next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
  
  let {statusCode=500,message="something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message});
  
});



  
 