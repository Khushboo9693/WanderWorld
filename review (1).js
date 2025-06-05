const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../models/review.js");
const wrapAsync=require("../util/wrapAsync.js");
const Listing =require("../models/listing");
const {reviewSchema}=require("../schema.js");

const validateReview=(req,res,next)=>{
  const {error}= reviewSchema.validate(req.body);
  
  if(error){
    throw new ExpressError(404,error.message);
  }else{
    next();
  }
  


}

router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing1=await Listing.findById(id);
    let {Rating,Comment}=req.body;
    let rew=new Review({
      comment:Comment,
      rating:Rating   
    });
    listing1.reviews.push(rew);
    rew.save();
    listing1.save();
    req.flash("super","Review was added");
    res.redirect(`/listings/${id}`);
  }));
  
  //delte review
  router.delete("/:rid",wrapAsync(async (req,res)=>{
    
    
    let {id,rid}=req.params;
    let q=await Listing.findByIdAndUpdate(id ,{ $pull :{reviews:rid}},{new:true});
    console.log(q);
    await Review.findByIdAndDelete(rid);
    req.flash("super","Review was deleted");
    res.redirect(`/listings/${id}`);
  
    
  }));
  
  module.exports=router;
