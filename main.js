// Import required modules
const express = require("express");
const _ = require("lodash");
const morgan = require("morgan");
const uuid = require("uuid");

// Create Express application
const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

// Import data
const games = require("./data/games");
const platforms = require("./data/platforms");

/*
====================================
ROOT ROUTE
====================================
*/
app.get("/", (req, res) => {
  res.json({
    message: "Video Game API Running",
  });
});

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
        game.platforms.some(
          (platform) =>
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

    // Valid sorting fields
    const validSortFields = [
      "name",
      "releaseYear",
    ];

    const sortBy = req.query.sortBy || "name";
    const order = req.query.order || "asc";

    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({
        message: `Invalid sortBy value. Use: ${validSortFields.join(
          ", "
        )}`,
      });
    }

    if (
      !["asc", "desc"].includes(
        order.toLowerCase()
      )
    ) {
      return res.status(400).json({
        message:
          "Order must be either 'asc' or 'desc'",
      });
    }

    results = _.sortBy(results, sortBy);

    if (order.toLowerCase() === "desc") {
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
      (foundGame) =>
        foundGame.id === req.params.id
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
    const {
      name,
      releaseYear,
      genres,
      platforms,
    } = req.body;

    // Validation
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

    const newGame = {
      id: uuid.v4(),
      name,
      releaseYear,
      genres,
      platforms,
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
UPDATE GAME
====================================
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
*/
app.delete("/api/games/:id", (req, res) => {
  try {
    const gameIndex = games.findIndex(
      (foundGame) =>
        foundGame.id === req.params.id
    );

    if (gameIndex === -1) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

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
Supports:
?sortBy=name
?sortBy=releaseYear
====================================
*/
app.get("/api/platforms", (req, res) => {
  try {
    const validSortFields = [
      "name",
      "releaseYear",
    ];

    const sortBy =
      req.query.sortBy || "name";

    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({
        message: `Invalid sortBy value. Use: ${validSortFields.join(
          ", "
        )}`,
      });
    }

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
*/
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    `Server is running on port ${port}`
  );
});