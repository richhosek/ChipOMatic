import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    color: "red",
    players: []
  }

  render() {
    return (
      <div className="App" style={{height:"50vh"}}>
        <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
          <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
          {/* <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke={this.state.color} strokeWidth="3"></circle> */}

          <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ce4b99" strokeWidth="10" strokeDasharray="10 90" strokeDashoffset="0"></circle>
          <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#b1c94e" strokeWidth="10" strokeDasharray="10 90" strokeDashoffset="-10"></circle>
          <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ce4b99" strokeWidth="10" strokeDasharray="10 90" strokeDashoffset="-20"></circle>
          <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#b1c94e" strokeWidth="10" strokeDasharray="10 90" strokeDashoffset="-30"></circle>
          <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ce4b99" strokeWidth="10" strokeDasharray="10 90" strokeDashoffset="-40"></circle>
          <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#b1c94e" strokeWidth="10" strokeDasharray="10 90" strokeDashoffset="-50"></circle>
          <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ce4b99" strokeWidth="10" strokeDasharray="10 90" strokeDashoffset="-60"></circle>
          <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#b1c94e" strokeWidth="10" strokeDasharray="10 90" strokeDashoffset="-70"></circle>
          <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ce4b99" strokeWidth="10" strokeDasharray="10 90" strokeDashoffset="-80"></circle>
          <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#b1c94e" strokeWidth="10" strokeDasharray="10 90" strokeDashoffset="-90"></circle>
          
        </svg>
        <button style={{fontSize:"3em"}}>SPIN</button>
      </div>
    );
  }
}

export default App;
