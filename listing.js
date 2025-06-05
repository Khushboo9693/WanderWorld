const express=require("express");
const router=express.Router({mergeParams:true});
const Listing =require("../models/listing");
const wrapAsync=require("../util/wrapAsync.js");
const ExpressError=require("../util/ExpressError.js");
const {listingSchema}=require("../schema.js");
const isLogged = require("../middleware.js");


const validateListing=(req,res,next)=>{
  const {error}= listingSchema.validate(req.body);
  
  if(error){
    throw new ExpressError(404,error.message);
  }else{
    next();
  }
}


router.get("/",(req,res)=>{
    Listing.find().then((res1)=>{
      
      let data=res1;
     
      res.render("listings/listings.ejs",{data});
    }).catch((err)=>{
      res.send("error");
    });
  
  });
  //new listing
  router.get("/new",isLogged,(req,res)=>{
    res.render("listings/new.ejs");
  });
  
  //show each post
  router.get("/:id",(req,res)=>{
    let {id}=req.params;
    Listing.find({_id:id}).populate("reviews").then((res1)=>{
      let data=res1[0];
      console.log(res1.length);
      if(res1.length!=0){
      res.render("listings/read.ejs",{data});
      }
      else
    {
     req.flash("error","Listing does not exist");
     res.redirect("/listings");

    }
      
    }).catch((err)=>{
      console.log("error");
    });
    });
  //create new listing
    router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
      
      
  
    let {title ,description, url,price,location,country}=req.body;
    
  
    let obj=new Listing({
      title:title,
      description:description,
      
      image:{
        url:url
      },
      price:price||0,
      location:location,
      country:country
    });
    
     await obj.save();
     req.flash("super","New listing is created!");
    res.redirect("/listings");
  
    
  }));

  router.get("/:id/edit",isLogged,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let data= await Listing.find({_id:id});
    if(data.length!=0){
    data=data[0];
    res.render("listings/edit.ejs",{data});
    }
    
  }));


  //update
  router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    
    let data= req.body;
    if(!req.body){
      throw new ExpressError(404,"bad request");
    }
    console.log(data);
    
    await Listing.findOneAndReplace({_id:id},{title:data.title, description:data.description,image:{url:data.url},price:data.price,location:data.location,country:data.country});
    
     req.flash("super","Listing was updated sucessfully ");
    res.redirect(`/listings/${id}`);

  }));
  
  //remove a listing
  router.delete("/:id",isLogged, wrapAsync( async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);

     req.flash("super","Listing was deleted sucessfully");
    res.redirect("/listings");
  }));



 
 

  module.exports=router;