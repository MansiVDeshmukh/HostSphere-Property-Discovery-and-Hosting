const mongoose=require("mongoose")
const Review=require("./review.js")
const Schema=mongoose.Schema

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    price:Number,
    image:{
        url:String,
        filename:String
    },
    location:String,
    country:String,
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
  type: {
    type: String,
    enum: ["Point"], // capital "P"
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
}

})

listingSchema.post("findOneAndDelete",async(listing)=>{
    await Review.deleteMany({_id:{$in:listing.reviews}})

})
const Listing=mongoose.model("Listing",listingSchema)
module.exports=Listing