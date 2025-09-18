const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
})

userSchema.plugin(passportLocalMongoose);  //plugin humare liye automatically username hashing salting ko implement krwa deta h

module.exports = mongoose.model("User", userSchema);