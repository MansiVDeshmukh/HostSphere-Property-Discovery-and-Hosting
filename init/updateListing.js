require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;
if (!mapToken) {
  throw new Error("❌ MAP_TOKEN is missing. Please set it in your .env file");
}

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// 🔹 Direct MongoDB connection (no need for MONGO_URL in .env)
mongoose.connect("mongodb://127.0.0.1:27017/wanderlust") 
  .then(() => console.log("✅ Mongo connected"))
  .catch(err => console.error("❌ Mongo error:", err));

async function updateGeometry() {
  try {
    const listings = await Listing.find({ "geometry": { $exists: false } });
    console.log(`Found ${listings.length} listings to update`);

    for (let listing of listings) {
      let response = await geocodingClient
        .forwardGeocode({
          query: listing.location,
          limit: 1,
        })
        .send();

      if (response.body.features.length > 0) {
        listing.geometry = response.body.features[0].geometry;
        await listing.save();
        console.log(`✅ Updated: ${listing.title}`);
      } else {
        console.log(`⚠️ No geocode found for: ${listing.title}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

updateGeometry();
