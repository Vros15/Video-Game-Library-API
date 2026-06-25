const express = require("express");
const uuid = require("uuid").v4;
const sort = require("../utils");

const router = express.Router();

let gamesData = require("../data/games");

/*
====================================
GET ALL GAMES
Supports filtering and sorting

Examples: 

Filter by platform
http://localhost:3000/api/v1/games?platform=PC
http://localhost:3000/api/v1/games?platform=Nintendo%20Switch
http://localhost:3000/api/v1/games?platform=Playstation%205
http://localhost:3000/api/v1/games?platform=Playstation%204
http://localhost:3000/api/v1/games?platform=Xbox
Filter by genre
http://localhost:3000/api/v1/games?genre=Action
http://localhost:3000/api/v1/games?genre=Adventure
http://localhost:3000/api/v1/games?genre=RPG
http://localhost:3000/api/v1/games?genre=Open%20World
http://localhost:3000/api/v1/games?genre=Simulation
Filter by release year
http://localhost:3000/api/v1/games?releaseYear=2022
http://localhost:3000/api/v1/games?releaseYear=2023
http://localhost:3000/api/v1/games?releaseYear=2024
http://localhost:3000/api/v1/games?releaseYear=2025
Sort by name
http://localhost:3000/api/v1/games?sortBy=name
http://localhost:3000/api/v1/games?sortBy=name&order=desc


====================================
*/


router.get("/", (req, res) => {
  let filteredResults = gamesData;

  // Filter games by platform or genre or release year
  if (req.query.platform) {
    console.log(req.query.platform);
    
    filteredResults = gamesData.filter((game) => {
      return game.platforms.includes(req.query.platform);
    });
  } else if (req.query.genre) {
    filteredResults = gamesData.filter((game) => {
      return game.genres.includes(req.query.genre);
    });
  } else if(req.query.releaseYear){
     filteredResults = gamesData.filter((game) => {
      return Number(req.query.releaseYear) === game.releaseYear;
    })
  }  

  // Sorting options
  const sortBy = req.query.sortBy || "";
  const order = req.query.order || "asc";

  const sortedGames = sort(filteredResults, sortBy, order);

  res.json(sortedGames);
});

/*
====================================
GET GAME BY ID
====================================
*/
router.get("/:id", (req, res) => {
  const foundGame = gamesData.find((game) => {
    return game.id === req.params.id;
  });

  if (foundGame) {
    res.json(foundGame);
  } else {
    res.status(404).json({ message: "Game not found" });
  }
});

/*
====================================
CREATE A NEW GAME
====================================
*/
router.post("/", (req, res) => {
  const foundGame = gamesData.find((game) => {
    return game.name === req.body.name;
  });

  if (!foundGame) {
    const newGame = {
      id: uuid(),
      name: req.body.name,
      genres: req.body.genres,
      releaseYear: req.body.releaseYear,
      platforms: req.body.platforms,
    };

    gamesData.push(newGame);
    res.json(newGame);
  } else {
    res.status(500).json({ message: "Game already exists" });
  }
});

/*
====================================
UPDATE AN EXISTING GAME
====================================
*/
router.put("/:id", (req, res) => {
  const foundGame = gamesData.find((game) => {
    return game.id === req.params.id;
  });

  if (foundGame) {
    const updatedGameData = {
      name: req.body.name || foundGame.name,
      genres: req.body.genres || foundGame.genres,
      releaseYear: req.body.releaseYear || foundGame.releaseYear,
      platforms: req.body.platforms || foundGame.platforms,
    };

    // Merge updated values into the existing object
    Object.assign(foundGame, updatedGameData);

    res.json(foundGame);
  } else {
    res.status(404).json({ message: "Game to update not found" });
  }
});

/*
====================================
DELETE A GAME
====================================
*/
router.delete("/:id", (req, res) => {
  const gameToDelete = gamesData.find((game) => {
    return req.params.id === game.id;
  });

  if (gameToDelete) {
    const results = gamesData.filter((game) => {
      return game.id !== gameToDelete.id;
    });

    gamesData = results;

    res.json({
      message: `${gameToDelete.name} has been successfully removed.`,
    });
  } else {
    res.status(404).json({ message: "Game to delete not found" });
  }
});

module.exports = router;