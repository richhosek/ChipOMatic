const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const db = require("./models")

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/chipomatic", { useNewUrlParser: true });

// Define API routes here
// This is a temporary implementation to get it working. 
// In later steps, I'll move this to other modules to keep the code in this file minimal

/**
 * Delete all players in the database
 */
app.delete("/api/player", (request, response) => {
  db.Player.deleteMany({})
  .then(result => response.json(result))
  .catch(error => response.status(500).json(error));
})

/**
 * Get all players in the database
 * who have not won yet, sort by name
 */
app.get("/api/player", (request, response) => {
  db.Player.find({hasWon: false}).sort({name: 1})
  .then(players => response.json(players))
  .catch(error => response.status(500).json(error));
})

/**
 * Add a new player.
 * This will return a 409 (conflict) if the player already exists
 */
app.post("/api/player", (request, response) => {
  db.Player.find({name: request.body.name})
  .then(players => {
    if (!players.length) {
      db.Player.create(request.body)
      .then(player => response.json(player));
    } else {
      response.status(409).send("Duplicate Player");
    }
  })
})

/**
 * Reset the hasWon property for testing
 */
app.put("/api/player/reset", (request, response) => {
  db.Player.updateMany({}, {hasWon: false})
  .then(result => response.json(result))
  .catch(error => response.status(500).json(error));
})

/**
 * Update the hasWon property to true
 * This likely can be expanded to accomodate correction names and chip counts
 */
app.put("/api/player/:playerId", (request, response) => {
  db.Player.findOneAndUpdate({_id: request.params.playerId}, {hasWon: true})
  .then(player  => response.json(player))
  .catch(error => response.status(500).json(error));
})



// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
