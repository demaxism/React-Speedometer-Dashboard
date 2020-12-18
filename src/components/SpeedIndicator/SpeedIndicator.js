import React, { Component } from 'react';
import './SpeedIndicator.css';
import '../DriveStateIcon/DriveStateIcon';
import DriveStateIcon from '../DriveStateIcon/DriveStateIcon';
let d3 = window.d3;

export default class SpeedIndicator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      speed : 0,
      driveState : 0,
      count : 0,
    }
    this.update = null;
  }

  componentWillReceiveProps(props) {
    this.setState({ speed : props.speedInput});
    this.setState({ driveState : props.driveStateInput});
    this.update();
  }

  componentDidMount() {

    let self = this;
    var outerRadius=150;
    var innerRadius=outerRadius - 12;
    var cornerRadius = 3;
    var gap = 0.0;

    var limit = 65;

    var startAngle = -0.75 * Math.PI;
    var endAngle = 0.75 * Math.PI;
    var limitAngle = limit / 100 * (endAngle - startAngle) + startAngle;

    // Arc rail of the speed indicator (the grey arc)
    // The arc rail before the speed limit
    var rail1 = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(0)
      .startAngle(startAngle).endAngle(limitAngle - gap);

    d3.select('#svg-back').append('path')
    .attr({
        d:rail1
    })
    .style({
        fill:'url(#grayGradient)',
        filter: 'url(#shadow)'
    });

    // The arc rail after the speed limit
    var rail2 = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(0)
      .startAngle(function(d) { return d.startAngle; })
      .endAngle(function(d) { return d.endAngle; });

    var steps = 3;
    var rail2Angle = (endAngle - limitAngle) * 180 / Math.PI;
    var fadeStart = 40;
    var fadeStep = 0.0012;
    var data = d3.range(rail2Angle / steps).map(function(d, i) {
      var pass = i * steps;
      return {
        flag: i,
        startAngle: limitAngle + pass * (Math.PI / 180),
        endAngle: limitAngle + (pass + steps) * (Math.PI / 180),
        fill: d3.hsl(0, 0, .13 - Math.max(pass - fadeStart, 0) * fadeStep).toString()
      };
    });

    d3.select('#svg-back').selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr('d', rail2)
      .attr("stroke-width", 1)
      .attr("flag", function(d) { return d.flag;})
      .attr("stroke", function(d) { return d.fill;})
      .attr("fill", function(d) { return d.fill; });

    // Shadow fan of the speed indicator
    var fanStep = 3;
    var fanRange = 30;
    var percentAngle = startAngle + (this.state.speed + 0.8) / 100 * (endAngle - startAngle);
    var fan = d3.svg.arc()
      .innerRadius(innerRadius * 0.7)
      .outerRadius(innerRadius)
      .startAngle(function(d) { return d.startAngle; })
      .endAngle(function(d) { return d.endAngle; });

    var fanData = ()=> {
      return d3.range(fanRange).map(function(d, i) {
        var pass = i * fanStep;
        var h = (self.state.speed < limit) ? 200 : 45;
        return {
          startAngle: percentAngle - pass * (Math.PI / 180),
          endAngle:Math.max(startAngle, percentAngle - (pass + fanStep) * (Math.PI / 180)),
          fill: d3.hsl(h, 0.8, 0.2 - i * 0.007).toString()
        }
      });
    }

    var drawFan = () => {
      d3.select('#svg-fan').selectAll("path")
      .data(fanData())
      .enter()
      .append("path")
      .attr('d', fan)
      .attr("stroke-width", 1)
      .attr("stroke", function(d) { return d.fill;})
      .attr("fill", function(d) { return d.fill; });
    }
    drawFan();

    // The speed indicator arc
    var arcLine = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(3)
      .startAngle(startAngle).endAngle(startAngle + (this.state.speed + 1) / 100 * (endAngle - startAngle));

    var drawSpeedIndct = () => {

      d3.select('#svg-g').append('path')
      .datum({endAngle:0})
      .attr({
          d: arcLine,
          id: 'arcguide'
      })
      .style({
        fill: (this.state.speed < limit) ? 'url(#gradient)' : 'url(#gradientHigh)',
        filter: (this.state.speed < limit) ? 'url(#dropGlow)' : 'url(#dropGlowHigh)',
      });
    }
    drawSpeedIndct();

    this.update = () => {
      if (this.state.speed <= 100 && this.state.speed >= 0) {
        // update speed indicator arc
        var angle = startAngle + (this.state.speed + 1) / 100 * (endAngle - startAngle);
        d3.select('#svg-g').selectAll("path").remove();
        arcLine.endAngle(angle);
        drawSpeedIndct();

        // update shadow fan
        d3.select('#svg-fan').selectAll("path").remove();
        percentAngle = startAngle + (this.state.speed + 0.8) / 100 * (endAngle - startAngle);
        drawFan();

        // update highlight
        var marker = d3.select('#glowMarker');
        if (this.state.speed < limit) {
          marker.attr('display', "none");
        }
        else {
          marker.attr('display', "block");
          var r = (innerRadius + outerRadius) / 2.0;
          var x = r * Math.sin(angle);
          var y = -r * Math.cos(angle);
          marker.attr('transform', `translate(${x}, ${y})`);
        }
      }
    }
  }

  render() {

    return (
      <div id='chart'>
        <svg width="700" height="400">
          <g transform="translate(350,200)" id="svg-back">

          </g>
          <g transform="translate(350,200)" id="svg-fan">

          </g>
          <g transform="translate(350,200)" id="svg-g">
            <defs>
              <filter id="shadow">
                <feDropShadow dx="2" dy="2" stdDeviation="10"/>
              </filter>
              <radialGradient id="grayGradient" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#1d1f20"></stop>
                <stop offset="100%" stop-color="#1d1f20"></stop>
              </radialGradient>
              <radialGradient id="grayFade" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#1d1f20"></stop>
                <stop offset="50%" stop-color="#1d1f20"></stop>
                <stop offset="100%" stop-color="#000000"></stop>
              </radialGradient>
              <linearGradient id="gradient" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#c9dcff"></stop>
                  <stop offset="100%" stop-color="#e8f0ff"></stop>
              </linearGradient>
              <filter id="dropGlow" height="3100%" width="3100%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
                <feColorMatrix
                type = "matrix"
                values="0.55     0     0     0     0
                        0     0.71     0     0     0
                        0     0     1     0     0
                        0     0     0     1     0 "/>
                <feOffset in="bluralpha" dx="0.000000" dy="0.000000" result="offsetBlur"/>
                <feMerge>
                    <feMergeNode in="offsetBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="gradientHigh" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#fdff9c"></stop>
                  <stop offset="100%" stop-color="#feffcc"></stop>
              </linearGradient>
              <filter id="dropGlowHigh" height="3100%" width="3100%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
                <feColorMatrix
                type = "matrix"
                values="1     0     0     0     0
                        0     0.9     0     0     0
                        0     0     0.5    0     0
                        0     0     0     1     0 "/>
                <feOffset in="bluralpha" dx="0.000000" dy="0.000000" result="offsetBlurHigh"/>
                <feMerge>
                    <feMergeNode in="offsetBlurHigh"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="softGlow" height="100" width="100" x="-1000%" y="-1000%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="20"></feGaussianBlur>
              </filter>
            </defs>
            <circle r="25" id="glowMarker" fill="#ffe063" filter="url(#softGlow)" display="none"></circle>
            <text class="counterText" text-anchor="middle" alignment-baseline="middle">{Math.round(this.state.speed)}</text>
          </g>
          <g id="driveStateCont">
            
          </g>
          
        </svg>
        <div class="driveStates" style={{left:"160px", top:"80px"}}><DriveStateIcon stateName="R" currentState={this.state.driveState} /></div>
        <div class="driveStates" style={{left:"134px", top:"125px"}}><DriveStateIcon stateName="N" currentState={this.state.driveState} /></div>
        <div class="driveStates" style={{left:"124px", top:"180px"}}><DriveStateIcon stateName="D" currentState={this.state.driveState} /></div>
        <div class="driveStates" style={{left:"134px", top:"235px"}}><DriveStateIcon stateName="P" currentState={this.state.driveState} /></div>
        <div class="driveStates" style={{left:"160px", top:"280px"}}><DriveStateIcon stateName="B" currentState={this.state.driveState} /></div>
      </div>
    )
  }
}