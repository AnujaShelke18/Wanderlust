const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Show all listings
module.exports.index = async (req, res) => {
  const { q, category } = req.query;
  let filter = {};

  if (typeof q === "string" && q.trim()) {
    const safeQ = escapeRegex(q.trim());
    filter = {
      $or: [
        { location: { $regex: safeQ, $options: "i" } },
        { country: { $regex: safeQ, $options: "i" } },
        { title: { $regex: safeQ, $options: "i" } },
      ],
    };
  }

  if (category) {
    filter.category = category;
  }

  const allListings = await Listing.find(filter);
  res.render("./listings/index.ejs", { allListings, category });
};


// Render new listing form
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

// Show individual listing
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  //  Pass mapToken to EJS for client-side access
  res.render("listings/show.ejs", { listing, mapToken });
};

// Create new listing
module.exports.createListing = async (req, res, next) => {
  try {
    if (!req.body.listing) {
      req.flash("error", "Invalid listing data!");
      return res.redirect("/listings/new");
    }

    // Mapbox Geocoding
    const geoResponse = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    if (!geoResponse.body.features.length) {
      req.flash("error", "Invalid location! Try another one.");
      return res.redirect("/listings/new");
    }

    const geoData = geoResponse.body.features[0].geometry;
    console.log("Geocoding data:", geoData);

    if (!req.file) {
      req.flash("error", "Please upload an image!");
      return res.redirect("/listings/new");
    }

    const newListing = new Listing({
      ...req.body.listing,
      geometry: geoData,
      image: {
        url: req.file.path,
        filename: req.file.filename,
      },
      owner: req.user._id,
    });

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error(" Error creating listing:", err);
    req.flash("error", "Failed to create listing.");
    res.redirect("/listings/new");
  }
};

// Render edit form
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url.replace(
    "/upload",
    "/upload/w_250,e_blur:100"
  );

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Update listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const { listing: listingData } = req.body;

  if (listingData.location && listingData.location !== listing.location) {
  const geoResponse = await geocodingClient
    .forwardGeocode({ query: listingData.location, limit: 1 })
    .send();

  if (geoResponse.body.features.length === 0) {
    req.flash("error", "Invalid location! Try another one.");
    return res.redirect(`/listings/${id}/edit`);
  }

  listing.geometry = geoResponse.body.features[0].geometry;
}

  Object.assign(listing, {
    title: listingData.title || listing.title,
    description: listingData.description || listing.description,
    price: listingData.price || listing.price,
    location: listingData.location || listing.location,
    country: listingData.country || listing.country,
    category: listingData.category || listing.category,
  });

  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  } else if (!listing.image?.url) {
    req.flash("error", "Image is required!");
    return res.redirect(`/listings/${id}/edit`);
  }

  await listing.save();
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

// Delete listing
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
