const Joi =require("joi");

const listingSchema=Joi.object({
    
        title:Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    url:Joi.string().allow("",null),
   
});

const reviewSchema=Joi.object({

  
    Rating:Joi.number().required().min(1).max(5),
    Comment:Joi.string().required()
   
});

module.exports ={
    listingSchema,
    reviewSchema
};

