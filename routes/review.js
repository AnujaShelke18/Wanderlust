const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require ("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
 
const reviewController = require("../Controllers/reviews.js");

//post review route
router.post("/", 
    isLoggedIn,
    validateReview, 
    wrapAsync (reviewController.postReview));

//Delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,
    wrapAsync (reviewController.destroyReview));

//Edit review route
router.get("/:reviewId/edit", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.editReview));

//update review route
router.put("/:reviewId", isLoggedIn, isReviewAuthor, validateReview, wrapAsync(reviewController.updateReview));

module.exports = router; 