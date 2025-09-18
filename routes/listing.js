const express = require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")
const Listing=require("../models/listing.js")
const {isLoggedIn,isOwner}=require("../middleware.js")
const path=require("path")

const listingController=require("../controllers/listings.js")

const multer=require("multer")
const{storage}=require("../cloudConfig.js")
const upload=multer({storage})

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router
  .route("/")
  // Index Route
  .get(wrapAsync(listingController.index))
  // Create Route
  .post(isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingController.create));
  


// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm );


router
    .route("/:id")
     // Show Route
    .get(wrapAsync(listingController.showListings))
    // Update Route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListings))
    // Delete Route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListings));

// Edit Route
router.get(
    "/:id/edit", isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.editListings)
);


module.exports = router;