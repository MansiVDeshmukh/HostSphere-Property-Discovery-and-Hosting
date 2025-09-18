const express=require("express")
const router=express.Router()
const User=require("../models/user.js")
const wrapAsync=require("../utils/wrapAsync.js")
const {userSchema}=require("../schema.js")
const ExpressError = require("../utils/ExpressError.js");
const passport=require("passport")
const{saveRedirectUrl}=require("../middleware.js")

const usersController=require("../controllers/users.js")

router.get("/signup",usersController.signUpForm)

const validateUser = (req, res, next) => {
    let { error } = userSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        req.flash("error", errMsg);
        return res.redirect("/signup"); // 👈 return so function stops
    } else {
        next();
    }
};


router.post("/signup",validateUser,wrapAsync(usersController.signUp))

router.route("/login")
    .get(usersController.logInForm)
    .post(saveRedirectUrl,passport.authenticate(
        'local',
        {failureRedirect:"/login",
        failureFlash:true}
        ),
        usersController.logIn)

router.get("/logout",usersController.logOut)
module.exports=router