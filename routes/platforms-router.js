/*
=====================================
IMPORTS
=====================================

express - creates router
sort - reusable helper function
platformsData - local platform data
*/
const express = require("express");

const router = express.Router();

/*
Import our temporary database
and sorting helper.
*/
const platformsData = require("../data/platforms");
const sort = require("../utils");

/*
=====================================
GET ALL PLATFORMS
=====================================
Examples:
GET /api/platforms
GET /api/platforms?sortBy=name
GET /api/platforms?sortBy=releaseYear&order=desc
*/

router.get("/", (req, res) => {

  const sortBy = req.query.sortBy || "name";
  const order = req.query.order || "asc";

  // Sort platforms using helper function
  const sortedPlatforms = sort(platformsData, sortBy, order);

  res.json(sortedPlatforms);
});

/*
=====================================
GET PLATFORM BY ID
=====================================

Searches for one platform whose
ID matches the route parameter.
*/
router.get("/:id", (req, res) => {

  // Convert route parameter to a Number
  // because platform IDs are stored as numbers
  const foundPlatform = platformsData.find((platform) => {
    return Number(req.params.id) === platform.id;
  });

  if (foundPlatform) {
    res.json(foundPlatform);
  } else {
    res.status(404).json({
      message: "Platform not found"
    });
  }
});


// Export router so it can be used inside index.js.
module.exports = router;