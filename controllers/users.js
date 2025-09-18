const User=require("../models/user.js")

module.exports.signUpForm=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signUp=async(req,res)=>{
    try{let{username,email,password}=req.body
    const newUser= new User({username,email})
    const registeredUser=await User.register(newUser,password)
    req.login(registeredUser,(err)=>{
        if(err){
        next(err)
        }
        req.flash("success","SignedUp Successfully..")
        res.redirect("/listings")
    })
} catch(err){
    req.flash("error",err.message)
    res.redirect("/signup")
}}

module.exports.logInForm=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.logIn=async(req,res)=>{
            req.flash("success","Welcome back to HostSphere,You are logged in...")
            let redirect=res.locals.redirectUrl || "/listings"
            res.redirect(redirect)
  
}

module.exports.logOut=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","Logged out successfully..")
        res.redirect("/listings")
    })
}