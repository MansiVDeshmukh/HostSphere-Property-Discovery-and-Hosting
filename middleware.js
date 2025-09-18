let Listing=require("./models/listing.js")
let Review=require("./models/review.js")

module.exports.isLoggedIn=(req, res,next) => {
    //req.user is an object that holds currently logged in users data.it automatically added by passport when user logs in successfully.
    if (!req.isAuthenticated()) {
        console.log(req.user)
        req.session.redirectUrl=req.originalUrl
        req.flash("error", "You are not logged in...");
        return res.redirect("/login");
    }
    next()
}
//passport automatically reset session when user successfully logged in into the website so redirectUrl deleted thats why 
//we ahve to store or save req.session.redirectUrl into locals as passport do not have access to delete locals
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
}

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
        let listing=await Listing.findById(id)
        if(!listing.owner._id.equals(res.locals.currUser._id)){
            req.flash("error","You are not owner of this listing..")
            return res.redirect(`/listings/${id}`);
        }
        next()
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
        let review=await Review.findById(reviewId)
        if(!review.author._id.equals(res.locals.currUser._id)){
            req.flash("error","You did not created this review..")
            return res.redirect(`/listings/${id}`);
        }
        next()
}