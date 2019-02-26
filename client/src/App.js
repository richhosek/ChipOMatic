import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Chip from "./chip.png"

let players = [];
const colors = [
  {
    background: "red",
    color: "white"
  }, {
    background: "yellow",
    color: "black"
  }, {
    background: "green",
    color: "white"
  }, {
    background: "blue",
    color: "white"
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      playerName: "",
      playerchips: "",
      players: [],
      wheelRotation: 0,
      pointingAt: 0,
      showWinner: false,
      winnerBackgroundColor: "white",
      winnerColor: "white",
      winnerName: ""
    }
    this.handleInputChange = this
      .handleInputChange
      .bind(this);
    this.handleAdd = this
      .handleAdd
      .bind(this);
    this.spin = this
      .spin
      .bind(this);
  }

  componentDidMount() {
    this.updatePlayers();
  }

  getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  culmulativePercent = (index, array) => {
    let percent = 0;
    for (let i = 0; i <= index; i++) {
      percent += array[i].percent;
    }
    return percent;
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleAdd(event) {
    event.preventDefault();
    // Save to database, then call update players to read it back
    // players.push({name: this.state.playerName, chips: this.state.playerchips});
    axios
      .post("/api/player", {
        name: this.state.playerName,
        chips: this.state.playerchips
      })
      .then(this.updatePlayers);

  }

  count = 10;
  rotation = 0;

  spin(event) {
    console.log("SPIN")
    event.preventDefault();
    this.rotateWheel(600 + Math.floor(Math.random() * 300), this.rotation);
  }

  rotateWheel = (step, rotation) => {

    this.setState({ wheelRotation: rotation });
    let invertedRotation = rotation == 0
      ? 0
      : 1 - rotation;

    let pointingAt = this
      .state
      .players
      .findIndex(player => player.percentStart <= invertedRotation && invertedRotation < player.percentEnd);
    this.setState({ pointingAt });
    // console.log("ROTATE WHEEL", step, rotation, pointingAt)
    step--;
    if (step > 300) {
      rotation += 0.01;
    } else {
      rotation += 0.01 * (step * step / 90000)
    }
    if (rotation >= 1) {
      rotation = 1 - rotation;
    }
    if (step > 0) {
      setTimeout(this.rotateWheel, 1, step, rotation);
    } else {
      console.log("STOPPED");
      axios
        .put("/api/player/" + this.state.players[pointingAt]._id)
        .then(() => {
          let winningPlayer = this.state.players[pointingAt];
          this.setState({ showWinner: true, winnerName: winningPlayer.name, winnerBackgroundColor: winningPlayer.color, winnerColor: winningPlayer.fontColor });
        })
    }
  }

  /**
 * nextRound
 * Once we dismiss the current winner popup, update the players
 * so that we're ready for a new spin
 */
  nextRound = (event) => {
    event.preventDefault();
    this.setState({ showWinner: false });
    this.updatePlayers();
  }

  /**
 * This is where we get the list of active players (those who have not won yet)
 * and convert that list to an array with the properties we need to render the spinner
 */
  updatePlayers = () => {
    // Get players from database
    axios
      .get("/api/player")
      .then(response => {
        let players = response.data;
        // Need the total chips to calculate each players percentage of the pool using
        // .reduce() here, I like .reduce()!
        let totalChips = players.reduce((chips, player) => chips + parseInt(player.chips), 0);
        // map the results from the api call to a new array convert chip count to
        // percentage and assign a color to the player
        let spinnerPlayers = players.map((player, index, players) => {
          // if the last color is the same as the first color, adjust it
          let colorIndex = (index == players.length - 1 && index % 4 == 0)
            ? 1
            : index % 4;
          return {
            percent: player.chips / totalChips,
            color: colors[colorIndex].background,
            fontColor: colors[colorIndex].color,
            name: player.name,
            chips: player.chips,
            _id: player._id
          }
        });
        // Once we have percentages for each player, get the culmulative percentages so
        // we can have the start and end percentags for drawing the pie segments and
        // rotating the names
        spinnerPlayers.forEach((player, index, players) => {
          console.log("SPINNER PLAYERS", index, player.percent)
          let percentStart = index > 0
            ? players[index - 1].percentEnd
            : 0;
          player.percentStart = percentStart;
          player.percentEnd = percentStart + player.percent;
        })
        this.setState({ players: spinnerPlayers })
      });
  }

  /**
 * Rendering the Spinner was adapted from this article by David Gilberson on Hacker Noon
 * It's a very informative and entertaining article and manages to skip over the hard math stuff
 * but still show you how to simply create your own custom pie charts using SVG
 */
  render() {
    return (
      <div className="App container">
        <h1>Chip-<img src={Chip} style={{
          height: "1em"
        }} />-Matic</h1>
        <div
          onClick={this.nextRound}
          className="winner"
          style={{
            display: this.state.showWinner
              ? "block"
              : "none",
            backgroundColor: this.state.winnerBackgroundColor,
            color: this.state.winnerColor
          }}>{this.state.winnerName}</div>
        <div className="d-flex">
          <div className="spinnerContainer">
            <div className="spinnerPointer">
              <i className="far fa-hand-point-left"></i>
            </div>
            <div
              onClick={this.spin}
              className="spinner"
              style={{
                transform: `rotate(${this.state.wheelRotation}turn)`
              }}>
              <svg viewBox="-1 -1 2 2">
                {this
                  .state
                  .players
                  .map((player, index, players) => {
                    let arcTo = this.getCoordinatesForPercent(player.percentEnd);
                    let moveTo = this.getCoordinatesForPercent(player.percentStart);
                    let largeArcFlag = player.percent > .5 ? 1 : 0;
                    return (
                      <path
                        key={`path${index}`}
                        d={`M ${moveTo[0]} ${moveTo[1]} A 1 1 0 ${largeArcFlag} 1 ${arcTo[0]} ${arcTo[1]} L 0 0`}
                        fill={player.color}></path>
                    )
                  })}
              </svg>
              {this
                .state
                .players
                .map((player, index, players) => {
                  let displayPercent = (player.percentStart + player.percentEnd) / 2;
                  return (
                    <span
                      key={`name${index}`}
                      className="name"
                      style={{
                        transformOrigin: `0 0`,
                        transform: `rotate(${displayPercent}turn)`
                      }}>
                      <span
                        style={{
                          color: player.fontColor
                        }}>{player.name}</span>
                    </span>
                  )
                })}
            </div>
          </div>
          <div className="flex-grow-1 player-list">
            <div className="d-flex flex-column">
              <div className="d-flex">
                <input
                  ref="nameInput"
                  onChange={this.handleInputChange}
                  className="form-control"
                  type="text"
                  name="playerName"
                  placeholder="name"
                  value={this.state.playerName}></input>
                <input
                  onChange={this.handleInputChange}
                  className="form-control"
                  type="text"
                  name="playerchips"
                  placeholder="chips"
                  style={{
                    width: "5em"
                  }}
                  value={this.state.playerchips}></input>
                <button onClick={this.handleAdd} className="btn btn-default">ADD</button>
              </div>
              {this
                .state
                .players
                .map((player, index) => (
                  <div
                    key={"namechips" + index}
                    className={index == this.state.pointingAt
                      ? "nameOutline"
                      : ""}
                    style={{
                      backgroundColor: player.color,
                      color: player.fontColor
                    }}>{player.name}
                    ({player.chips})</div>
                ))}
            </div>
          </div>

        </div>

      </div>
    );
  }
}

export default App;