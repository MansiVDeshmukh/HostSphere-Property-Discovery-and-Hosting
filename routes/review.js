const express=require("express")
const router=express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {reviewSchema}=require("../schema.js")
const Review=require("../models/review.js")
const Listing=require("../models/listing.js")
const {isLoggedIn,isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/reviews.js")
//validate review
const validateReview=((req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)/* is means that the body we are getting is following schema defined in schema.js using joi or not */
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(404,errMsg)
    }
    else{
        next()
    }
})

//adding reviews
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.addReviews))

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReviews))

module.exports=router