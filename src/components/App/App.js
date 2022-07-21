import React, {Component} from 'react';
import Instructions from '../Instructions/Instructions';
import SpeedIndicator from '../SpeedIndicator/SpeedIndicator';
import './App.css';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      speed : 0,
      count : 0,
      driveStateNum : 2,
      isAcc : false
    }
  }

  componentDidMount() {

    document.addEventListener('keydown', (event) => {
      if (event.key === ' ') {
        this.setState({ isAcc : true });
      }
    });
    document.addEventListener('keyup', (event) => {
      if (event.key === ' ') {
        this.setState({ isAcc : false });
      }
      else if (event.keyCode === 38 ) {
        if (this.state.driveStateNum > 0) {
          this.setState({driveStateNum: this.state.driveStateNum - 1});
        }
      } // up arrow
      else if (event.keyCode === 40 ) {
        if (this.state.driveStateNum < 4) {
          this.setState({driveStateNum: this.state.driveStateNum + 1});
        }
      } // down arrow
    });

    const update = () => {
      const acc = 0.5;
      if (this.state.isAcc) {
        if (this.state.speed < 100) {
          this.setState({ speed : this.state.speed + acc});
        }
      }
      else {
        if (this.state.speed > 0)
        this.setState({ speed : this.state.speed - acc});
      }
      // console.log("update " + this.state.count);
      window.requestAnimationFrame(update);
    }
    update();

    this.setState({driveStateNum: 2});
  }

  render() {
    return (
      <div className="container">
        <h1>Speedometer Demo</h1>
        <Instructions cname='demax'/>
        <SpeedIndicator speedInput={this.state.speed} driveStateInput={this.state.driveStateNum} />
      </div>
    );
  }
}
