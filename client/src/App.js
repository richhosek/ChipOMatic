import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { set } from "mongoose";

let players = [];
const colors =[{background: "red", color: "white"},
{background: "yellow", color: "black"},
{background: "green", color: "white"},
{background: "blue", color: "white"}];

class App extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      playerName: "",
      playerchips: "",
      players: [],
      wheelRotation: 0
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.spin = this.spin.bind(this);
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
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleAdd(event){
    event.preventDefault();
    // Save to database, then call update players to read it back
    // players.push({name: this.state.playerName, chips: this.state.playerchips});
    axios.post("/api/player", {name: this.state.playerName, chips: this.state.playerchips})
    .then(this.updatePlayers);
    
  }

  count = 10;
  rotation = 0;

  spin(event) {
    console.log("SPIN")
    event.preventDefault();
    this.rotateWheel(100, 0);
  }

  rotateWheel = (step, rotation) => {
    console.log("ROTATE WHEEL", step, rotation)
    this.setState({wheelRotation: rotation});
    step--;
    rotation += 0.01;
    if (step > 0) {
      setTimeout(this.rotateWheel, 10, step, rotation);
    }
  }

  updatePlayers = () => {
    // Get players from database
    axios.get("/api/player")
    .then(response => {
      let players = response.data;
      let totalChips = players.reduce((chips, player) => chips + parseInt(player.chips), 0);
      console.log("TOTAL CHIPS", totalChips)
      let spinnerPlayers = players.map((player, index, players) =>{
        return { percent: player.chips / totalChips, color: colors[index % 4].background, fontColor: colors[index % 4].color, name: player.name, chips: player.chips }
      })
      this.setState({players: spinnerPlayers})
    });
  }

  render() {
    return (
      <div className="App container">
        <div className="d-flex">
          <div className="spinner" style={{transform: `rotate(${this.state.wheelRotation}turn)`}}>
            <svg viewBox="-1 -1 2 2">
            {this.state.players.map((player, index, players) => {
              let arcTo = this.getCoordinatesForPercent(this.culmulativePercent(index, players));
              let moveTo = index > 0 ? this.getCoordinatesForPercent(this.culmulativePercent(index - 1, players)) :
              [1, 0];
              let largeArcFlag = player.percent > .5 ? 1 : 0;
              return (
              <path key={`path${index}`} d={`M ${moveTo[0]} ${moveTo[1]} A 1 1 0 ${largeArcFlag} 1 ${arcTo[0]} ${arcTo[1]} L 0 0`} fill={player.color}></path>
            )})}
            {/* <path d="M 1 0 A 1 1 0 0 1 0.8090169943749475 0.5877852522924731 L 0 0" fill="Coral"></path>
            <path d="M 0.8090169943749475 0.5877852522924731 A 1 1 0 1 1 -1.8369701987210297e-16 -1 L 0 0" fill="CornflowerBlue"></path> */}
            </svg>
            {this.state.players.map((player, index, players) => {
              let previousPlayerPercent = index == 0 ? 0 : this.culmulativePercent(index - 1, this.state.players);
              let displayPercent = (previousPlayerPercent + this.culmulativePercent(index, this.state.players)) / 2;
              return (<span key={`name${index}`} className="name" style={{transformOrigin: `0 0`,transform: `rotate(${displayPercent}turn)`}}><span style={{color: player.fontColor}}>{player.name}</span></span>)
            })}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex">
              <input ref="nameInput" onChange={this.handleInputChange} className="form-control" type="text" name="playerName" placeholder="name" value={this.state.playerName}></input><input onChange={this.handleInputChange} className="form-control" type="text" name="playerchips" placeholder="chips" style={{width: "5em"}} value={this.state.playerchips}></input><button onClick={this.handleAdd} className="btn btn-default">ADD</button>
            </div>
          </div>
        </div>
        <button style={{fontSize:"3em"}} onClick={this.spin}>SPIN</button>
        
        
      </div>
    );
  }
}

export default App;
