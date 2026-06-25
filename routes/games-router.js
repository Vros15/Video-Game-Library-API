/*
=====================================
IMPORTS
=====================================

express - creates router
uuid - generates unique IDs
sort - custom helper function from Utils.js
*/
const express = require("express");
const uuid = require("uuid").v4;
const sort = require("../utils");


const router = express.Router();


// Import local game data.
let gamesData = require("../data/games");

/*
=====================================
GET ALL GAMES
=====================================
GET /api/games
GET /api/games?sortBy=name
GET /api/games?sortBy=releaseYear&order=desc
*/
router.get("/", (req, res) => {

  // Default values if user doesn't
  // provide query parameters
  const sortBy = req.query.sortBy || "name";
  const order = req.query.order || "asc";

  // Sort using helper function
  const sortedGames = sort(gamesData, sortBy, order);

  // Return results if any exist
  if (sortedGames.length > 0) {
    res.json(sortedGames);
  } else {
    res.status(404).json({
      message: "No results"
    });
  }
});

/*
=====================================
GET GAME BY ID
=====================================

Searches the array for one game
whose id matches the route parameter.
*/
router.get("/:id", (req, res) => {

  // find() returns the first match
  const foundGame = gamesData.find((game) => {
    return game.id === req.params.id;
  });

  if (foundGame) {
    res.json(foundGame);
  } else {
    res.status(404).json({
      message: "Game not found"
    });
  }
});

/*
=====================================
CREATE NEW GAME
=====================================

Adds a new game to the array.

A UUID is generated so every
game has a unique identifier.
*/
router.post("/", (req, res) => {

  // Check if game already exists
  const foundGame = gamesData.find((game) => {
    return game.name === req.body.name;
  });

  if (!foundGame) {

    // Build new object from request body
    const newGame = {
      id: uuid(),
      name: req.body.name,
      genres: req.body.genres,
      releaseYear: req.body.releaseYear,
      platforms: req.body.platforms,
    };

    // Save game into array
    gamesData.push(newGame);

    res.json(newGame);

  } else {

    res.status(500).json({
      message: "Game already exists"
    });

  }
});

/*
=====================================
UPDATE GAME
=====================================

Updates only the values sent
in the request body.

Existing values stay unchanged.
*/
router.put("/:id", (req, res) => {

  // Find game to update
  const foundGame = gamesData.find((game) => {
    return game.id === req.params.id;
  });

  if (foundGame) {

    // Keep old values if user
    // doesn't provide new ones
    const updatedGameData = {
      name: req.body.name || foundGame.name,
      genres: req.body.genres || foundGame.genres,
      releaseYear: req.body.releaseYear || foundGame.releaseYear,
      platforms: req.body.platforms || foundGame.platforms,
    };

    // Copy new values onto existing object
    Object.assign(foundGame, updatedGameData);

    res.json(foundGame);

  } else {

    res.status(404).json({
      message: "Game to update not found"
    });

  }
});

/*
=====================================
DELETE GAME
=====================================

Removes a game from the array
using its ID.
*/
router.delete("/:id", (req, res) => {

  // Locate the game first
  const gameToDelete = gamesData.find((game) => {
    return req.params.id === game.id;
  });

  if (gameToDelete) {

    // Keep every game except
    // the one being deleted
    const results = gamesData.filter((game) => {
      return game.id !== gameToDelete.id;
    });

    // Replace original array
    gamesData = results;

    res.json({
      message: `${gameToDelete.name} has been successfully removed.`,
    });

  } else {

    res.status(404).json({
      message: "Game to delete not found"
    });

  }
});

/*
Export router so index.js
can mount it with:

app.use("/api/games", router)
*/
module.exports = router;