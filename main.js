// Import required modules
const express = require("express");
const _ = require("lodash");
const morgan = require("morgan");
const uuid = require("uuid");

// Create an instance of the Express application
const app = express();

// Middleware setup
app.use(morgan("dev"));
app.use(express.json());

// Import data
const games = require("./data/games");
const platforms = require("./data/platforms");

/*
====================================
GET ALL GAMES
Supports:
?platform=PC
?genre=Action
?year=2025
?sortBy=name
?sortBy=releaseYear
?order=asc
?order=desc
====================================
*/
app.get("/api/games", (req, res) => {
  try {
    let results = [...games];

    // Filter by platform
    if (req.query.platform) {
      results = results.filter((game) =>
        game.platforms.some((platform) =>
            platform.toLowerCase() ===
            req.query.platform.toLowerCase()
        )
      );
    }

    // Filter by genre
    if (req.query.genre) {
      results = results.filter((game) =>
        game.genres.some(
          (genre) =>
            genre.toLowerCase() ===
            req.query.genre.toLowerCase()
        )
      );
    }

    // Filter by release year
    if (req.query.year) {
      results = results.filter(
        (game) =>
          game.releaseYear === Number(req.query.year)
      );
    }

    // Sort results
    const sortBy = req.query.sortBy || "name";
    const order = req.query.order || "asc";

    results = _.sortBy(results, sortBy);

    if (order === "desc") {
      results.reverse();
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

/*
====================================
GET GAME BY ID
====================================
*/
app.get("/api/games/:id", (req, res) => {
  try {
    const game = games.find(
      (foundGame) => foundGame.id === req.params.id
    );

    if (!game) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
====================================
CREATE NEW GAME
====================================
*/
app.post("/api/games", (req, res) => {
  try {
    const newGame = {
      id: uuid.v4(),
      name: req.body.name,
      releaseYear: req.body.releaseYear,
      genres: req.body.genres,
      platforms: req.body.platforms,
    };

    games.push(newGame);

    res.status(201).json({
      message: "Game created successfully",
      payload: newGame,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
====================================
UPDATE EXISTING GAME
====================================
*/

// Update an existing game by ID
app.put("/api/games/:id", (req, res) => {
    // Find the game by ID
    try {
    const game = games.find(
      (foundGame) => foundGame.id === req.params.id
    );
    // If the game is not found, return a 404 error
    if (!game) {
      return res.status(404).json({
        message: "Game not found",
      });
    }
    // Update the game's properties if they are provided in the request body
    if (req.body.name !== undefined) {
      game.name = req.body.name;
    }
    // If the name is not provided in the request body, it will not be updated
    if (req.body.releaseYear !== undefined) {
      game.releaseYear = req.body.releaseYear;
    }
    // If the release year is not provided in the request body, it will not be updated
    if (req.body.genres !== undefined) {
      game.genres = req.body.genres;
    }
    // If the genres are not provided in the request body, they will not be updated

    if (req.body.platforms !== undefined) {
      game.platforms = req.body.platforms;
    }
    // If the platforms are not provided in the request body, they will not be updated
    // After updating the game's properties, return the updated game object
    res.json({
      message: "Game updated successfully",
      payload: game,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
====================================
DELETE GAME
====================================
*/
app.delete("/api/games/:id", (req, res) => {
  try {
    // Find the index of the game by ID
    const gameIndex = games.findIndex(
      (foundGame) => foundGame.id === req.params.id
    );
    // If the game is not found, return a 404 error
    if (gameIndex === -1) {
      return res.status(404).json({
        message: "Game not found",
      });
    }
    // Remove the game from the array
    const deletedGame = games.splice(gameIndex, 1);

    res.json({
      message: "Game deleted successfully",
      payload: deletedGame[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
====================================
GET ALL PLATFORMS
Supports:
?sortBy=name
?sortBy=releaseYear
====================================
*/
app.get("/api/platforms", (req, res) => {
    // Get the sortBy query parameter, default to "name"
    try {
    const sortBy = req.query.sortBy || "name";
    // Sort the platforms array based on the sortBy parameter
    const sortedPlatforms = _.sortBy(
      platforms,
      sortBy
    );
    // Return the sorted array of platforms
    res.json(sortedPlatforms);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});



/*
====================================
GET PLATFORM BY ID
====================================
*/
app.get("/api/platforms/:id", (req, res) => {
  // Find the platform by ID
  try {
      const platform = platforms.find(
          (foundPlatform) => String(foundPlatform.id) === req.params.id
        );
        
        // If the platform is not found, return a 404 error
        if (!platform) {
            return res.status(404).json({
                message: "Platform not found",
            });
        }
        
    // Return the platform object
    res.json(platform);
  } catch (error) {
    // If an error occurs, return a 500 error
    res.status(500).json({
      message: error.message,
    });
  }
});



/*
====================================
START SERVER
====================================
*/
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});