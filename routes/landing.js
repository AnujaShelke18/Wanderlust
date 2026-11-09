const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require ("../utils/wrapAsync.js");

router.get("/", wrapAsync(async (req, res) => {
   const featured = await Listing.find({}).limit(4);
   res.render("home.ejs", { featured });
}));

module.exports = router;