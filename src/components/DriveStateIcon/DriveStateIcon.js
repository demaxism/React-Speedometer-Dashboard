import React, { Component } from 'react';
import './DriveStateIcon.css';

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
    const driveStateMap = {
      0: "R", 1: "N", 2: "D", 3: "P", 4: "B"
    }
    const stateChar = driveStateMap[props.currentState];

    if (this.state.stateName === stateChar) {
      this.setState({ isEnabled : true});
    }
    else {
      this.setState({ isEnabled : false});
    }
  }

  render() {
    const showStyle = this.state.isEnabled ? "driveState selected" : "driveState unselected";
    return (
      <div id="stateIcon" class={showStyle}>{this.state.stateName}</div>
    )
  }
}