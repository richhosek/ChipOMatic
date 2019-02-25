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
app.get("/api/player", (request, response) => {
  db.Player.find().sort({name: 1})
  .then(players => response.json(players))
  .catch(error => response.status(500).json(error));
})

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
