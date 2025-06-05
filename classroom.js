const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");
const path=require('path');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

const sessionOptions={
    secret:"mysupersecret" ,
    resave:false, 
    saveUninitialized:true
}

app.use(session(sessionOptions));
app.use(flash()); 

app.get("/register",(req,res)=>{
    let {name}=req.query;
    req.session.name=name;
    req.flash("username","you are now the part of biggest cartel");
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    
    res.render("index.ejs",{name:req.session.name,msg:req.flash("username")});
});



app.listen(8080,()=>{
    console.log("server is listening");
});