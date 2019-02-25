import React, { Component } from "react";
import "./App.css";

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
      players: [{ percent: 0.25, color: 'Coral', name: "Rich", chips: 5 },
      { percent: 0.25, color: 'CornflowerBlue', name: "Joe", chips: 5 },
      { percent: 0.5, color: '#00ab6b', name: "Andrew", chips: 10 }]
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
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
    players.push({name: this.state.playerName, chips: this.state.playerchips});
    this.updatePlayers();
  }

  updatePlayers = () => {
    // Get players from database
    let totalChips = players.reduce((chips, player) => chips + parseInt(player.chips), 0);
    console.log("TOTAL CHIPS", totalChips)
    let spinnerPlayers = players.map((player, index, players) =>{
      return { percent: player.chips / totalChips, color: colors[index % 4].background, fontColor: colors[index % 4].color, name: player.name, chips: player.chips }
    })
    this.setState({players: spinnerPlayers})
  }

  render() {
    return (
      <div className="App container">
        <div className="d-flex">
          <div className="spinner">
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
        <button style={{fontSize:"3em"}}>SPIN</button>
        
        
      </div>
    );
  }
}

export default App;
