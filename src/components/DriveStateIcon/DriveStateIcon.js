import React, { Component } from 'react';
import './DriveStateIcon.css';
let d3 = window.d3;

export default class DriveStateIcon extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateName : props.stateName,
      currentState : null,
      isEnabled : false
    }
  }

  componentWillReceiveProps(props) {
    let driveStateMap = {
      0: "R", 1: "N", 2: "D", 3: "P", 4: "B"
    }
    let stateChar = driveStateMap[props.currentState];

    if (this.state.stateName === stateChar) {
      this.setState({ isEnabled : true});
    }
    else {
      this.setState({ isEnabled : false});
    }
  }

  render() {
    let showStyle;
    if (this.state.isEnabled) {
      showStyle = "driveState selected";
    }
    else {
      showStyle = "driveState unselected";
    }
    return (
      <div id="stateIcon" class={showStyle}>{this.state.stateName}</div>
    )
  }
}