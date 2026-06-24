// Import required packages
// express -> creates our API server
// lodash -> utility library (used for sorting)
// morgan -> logs requests to the terminal
// uuid -> generates unique IDs
const express = require("express");
const _ = require("lodash");
const morgan = require("morgan");
const uuid = require("uuid");

// Create Express application instance
const app = express();

/*
====================================
MIDDLEWARE
====================================
Middleware runs before routes.

morgan("dev")
- Logs incoming requests
- Example:
  GET /api/games 200 5ms

express.json()
- Allows Express to read JSON
  data sent in POST/PUT requests
*/
app.use(morgan("dev"));
app.use(express.json());

/*
====================================
IMPORT DATA
====================================
Load local data arrays from files.
These act as our temporary database.
*/
const games = require("./data/games");
const platforms = require("./data/platforms");

/*
====================================
ROOT ROUTE
====================================
Landing page for the API - HTML Format

*/
app.get("/", (req, res) => {
  res.send(`
    <h1>Video Game API</h1>

    <h2>Games</h2>
    <ul>
      <li><a href="/api/games">GET All Games</a></li>
      <li><a href="/api/games?platform=PC">Filter by Platform</a></li>
      <li><a href="/api/games?genre=Action">Filter by Genre</a></li>
      <li><a href="/api/games?year=2023">Filter by Year</a></li>
      <li><a href="/api/games?sortBy=releaseYear&order=desc">Sort by Release Year Descending</a></li>
    </ul>

    <h2>Platforms</h2>
    <ul>
      <li><a href="/api/platforms">GET All Platforms</a></li>
    </ul>

    <p>Use Postman or Insomnia for POST, PUT, and DELETE requests.</p>
  `);
});

/*
====================================
GET ALL GAMES
====================================
Ex.
GET /api/games?platform=PC
GET /api/games?genre=Action
GET /api/games?year=2023
*/

app.get("/api/games", (req, res) => {
  try {

    // Create a copy so we don't modify
    // the original games array
    let results = [...games];

    /*
    ==========================
    FILTERING
    ==========================
    */

    // Keep only games that contain
    // the requested platform
    if (req.query.platform) {
      results = results.filter((game) =>
        game.platforms.some(
          (platform) =>
            platform.toLowerCase() ===
            req.query.platform.toLowerCase()
        )
      );
    }

    // Keep only games that contain
    // the requested genre
    if (req.query.genre) {
      results = results.filter((game) =>
        game.genres.some(
          (genre) =>
            genre.toLowerCase() ===
            req.query.genre.toLowerCase()
        )
      );
    }

    // Keep only games from a specific year
    if (req.query.year) {
      results = results.filter(
        (game) =>
          game.releaseYear === Number(req.query.year)
      );
    }

    /*
    ==========================
    SORTING
    ==========================
    */

    // Allowed fields users can sort by
    const validSortFields = [
      "name",
      "releaseYear",
    ];

    // Default sorting values
    const sortBy = req.query.sortBy || "name";
    const order = req.query.order || "asc";

    // Validate sort field
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({
        message: `Invalid sortBy value. Use: ${validSortFields.join(", ")}`
      });
    }

    // Validate sort order
    if (!["asc", "desc"].includes(order.toLowerCase())) {
      return res.status(400).json({
        message: "Order must be either 'asc' or 'desc'",
      });
    }

    // Sort ascending using lodash
    results = _.sortBy(results, sortBy);

    // Reverse array for descending order
    if (order.toLowerCase() === "desc") {
      results.reverse();
    }

    // Return final filtered/sorted results
    res.json(results);

  } catch (error) {

    // Catch unexpected server errors
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

Returns a single game based on
its unique ID.
*/
app.get("/api/games/:id", (req, res) => {
  try {

    // Search for matching game
    const game = games.find(
      (foundGame) =>
        foundGame.id === req.params.id
    );

    // Return 404 if not found
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

POST /api/games

Creates a new game object and
adds it to the games array.
*/
app.post("/api/games", (req, res) => {
  try {

    // Pull values from request body
    const {
      name,
      releaseYear,
      genres,
      platforms,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !releaseYear ||
      !Array.isArray(genres) ||
      !Array.isArray(platforms)
    ) {
      return res.status(400).json({
        message:
          "name, releaseYear, genres, and platforms are required",
      });
    }

    // Build new game object
    const newGame = {
      id: uuid.v4(), // generate unique ID
      name,
      releaseYear,
      genres,
      platforms,
    };

    // Save into array
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
UPDATE GAME
====================================

PUT /api/games/:id

Updates only the fields provided.
Leaves everything else unchanged.
*/
app.put("/api/games/:id", (req, res) => {
  try {

    const game = games.find(
      (foundGame) =>
        foundGame.id === req.params.id
    );

    if (!game) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    // Use incoming value if supplied,
    // otherwise keep existing value
    const updatedGame = {
      name:
        req.body.name !== undefined
          ? req.body.name
          : game.name,

      releaseYear:
        req.body.releaseYear !== undefined
          ? req.body.releaseYear
          : game.releaseYear,

      genres:
        req.body.genres !== undefined
          ? req.body.genres
          : game.genres,

      platforms:
        req.body.platforms !== undefined
          ? req.body.platforms
          : game.platforms,
    };

    // Copy updated values onto original object
    Object.assign(game, updatedGame);

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

Removes a game from the array
using its ID.
*/
app.delete("/api/games/:id", (req, res) => {
  try {

    // Find index of matching game
    const gameIndex = games.findIndex(
      (foundGame) =>
        foundGame.id === req.params.id
    );

    if (gameIndex === -1) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    // Remove one item from array
    const deletedGame = games.splice(
      gameIndex,
      1
    );

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
====================================

Returns all platforms.
Optional sorting supported.
*/
app.get("/api/platforms", (req, res) => {
  try {

    const validSortFields = [
      "name",
      "releaseYear",
    ];

    const sortBy =
      req.query.sortBy || "name";

    // Validate requested sort field
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({
        message: `Invalid sortBy value. Use: ${validSortFields.join(", ")}`
      });
    }

    // Sort platform array
    const sortedPlatforms = _.sortBy(
      platforms,
      sortBy
    );

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

Returns one platform object.
*/
app.get("/api/platforms/:id", (req, res) => {
  try {

    const platform = platforms.find(
      (foundPlatform) =>
        String(foundPlatform.id) ===
        req.params.id
    );

    if (!platform) {
      return res.status(404).json({
        message: "Platform not found",
      });
    }

    res.json(platform);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
====================================
START SERVER
====================================

Use environment port if deployed.
Otherwise run locally on port 3000.
*/
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    `Server is running on port ${port}`
  );
});