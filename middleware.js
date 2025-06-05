const isLogged=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.flash("error","You are required to logged in");
      res.redirect("/login");
    }else
    {
        next();
    }
    
}

module.exports=isLogged;