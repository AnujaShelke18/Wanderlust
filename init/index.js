
require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const initData = require("./data.js");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    if (!dbUrl) {
        throw new Error("ATLASDB_URL not found in .env");
    }

    await mongoose.connect(dbUrl);
    console.log("Connected to Atlas DB");

    const user = await User.findOne();

    if (!user) {
        throw new Error("No registered user found in Atlas!");
    }

    await Listing.deleteMany({});

    const updatedListings = initData.data.map((listing) => ({
        ...listing,
        owner: user._id
    }));

    await Listing.insertMany(updatedListings);

    console.log("Listings initialized successfully!");
}

main()
    .catch((err) => {
        console.error("Initialization failed:", err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.connection.close();
    });
