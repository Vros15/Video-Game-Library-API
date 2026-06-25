/*
=====================================
IMPORTS
=====================================

express - web framework
morgan - logs incoming requests
*/
const express = require("express");
const logger = require("morgan");

/*
Create the Express application.
Everything will be attached to this app.
*/
const app = express();

/*
=====================================
MIDDLEWARE
=====================================

Runs before requests reach our routes.

logger("dev")
- Displays requests in the terminal

express.json()
- Allows Express to read JSON
  sent in POST and PUT requests
*/
app.use(logger("dev"));
app.use(express.json());

/*
=====================================
ROUTES
=====================================
*/
const gamesRouter = require("./routes/games-router");
const platformsRouter = require("./routes/platforms-router");


app.use("/api/v1/games", gamesRouter);
app.use("/api/v1/platforms", platformsRouter);

/*
=====================================
START SERVER
=====================================

Listen for incoming requests
on port 3000.
*/
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
});