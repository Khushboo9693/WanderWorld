const mongoose=require("mongoose");
const schema=mongoose.Schema;
const Review=require("./review");

const listingSchema= new schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{ 
        filename:{
        
            default:"img.jpg",
            type:String,
        },
        url:{
            
            type:String,
            default:"https://media.istockphoto.com/id/547516752/photo/coconut-palm-trees-on-white-sandy-beach.jpg?s=612x612&w=0&k=20&c=5fVUhFEoBBvy_nPT2xx67lqfyXLpzFzt91H0fgGOVE4=",
            set: function(value){
                return value || "https://media.istockphoto.com/id/547516752/photo/coconut-palm-trees-on-white-sandy-beach.jpg?s=612x612&w=0&k=20&c=5fVUhFEoBBvy_nPT2xx67lqfyXLpzFzt91H0fgGOVE4=";
            }
           
        }
        
    },
    
    
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId ,
            ref: "Review",
        }
    ]
});

listingSchema.post("findOneAndDelete", async (listing)=>{
     await Review.deleteMany({_id: {$in:listing.reviews}});
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing; 

