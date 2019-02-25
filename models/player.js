const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: { type: String, required: true },
  chips: { type: Number, required: true },
  hasWon: {type: Boolean, default: false }
});

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
