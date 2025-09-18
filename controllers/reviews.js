const Review=require("../models/review.js")
const Listing=require("../models/listing.js")
module.exports.addReviews=async(req,res)=>{
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review)
    listing.reviews.push(newReview)
    newReview.author=req.user._id
    await newReview.save()
    await listing.save()
    req.flash("success","New review created..")
    res.redirect(`/listings/${listing._id}`)
}

module.exports.deleteReviews=async(req,res)=>{
    let {id,reviewId}=req.params
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)

    req.flash("success","Existing review deleted..")
    res.redirect(`/listings/${id}`)
}