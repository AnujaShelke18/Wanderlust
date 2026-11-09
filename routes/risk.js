const express = require("express");
const router = express.Router();
const { assess } = require("../utils/riskData.js");

router.get("/", (req, res) => {
  res.render("risk/checker.ejs");
});

router.get("/result", (req, res) => {
  const { destination, start, end } = req.query;
  const s = new Date(start);
  const e = new Date(end);

  if (!destination || !destination.trim() || isNaN(s) || isNaN(e)) {
    req.flash("error", "Please enter a destination and both dates.");
    return res.redirect("/risk-checker");
  }
  if (e < s) {
    req.flash("error", "The end date can't be before the start date.");
    return res.redirect("/risk-checker");
  }

  const days = Math.round((e - s) / 86400000) + 1;
  if (days > 365) {
    req.flash("error", "Trips longer than a year aren't supported.");
    return res.redirect("/risk-checker");
  }

  const result = assess(destination.trim(), s, e);
  res.render("risk/result.ejs", { destination: destination.trim(), start, end, days, result });
});

module.exports = router;