import React, {Component} from 'react';
import Instructions from '../Instructions/Instructions';
import Meter from '../Meter/Meter';
import Drawer from '../Drawer/Drawer';
import './App.css';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      speed : 0,
      count : 0,
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
    });

    var update = () => {
      let acc = 0.5;
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
  }

  render() {
    return (
      <div className="container">
        <h1 id={this.state.greeting}>Hello, World</h1>
        <Instructions cname='demax'/>
        <Drawer speedInput={this.state.speed} />
      </div>
    );
  }
}
