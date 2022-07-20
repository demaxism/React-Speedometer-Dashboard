import React, { Component } from 'react';
import './SpeedIndicator.css';
import '../DriveStateIcon/DriveStateIcon';
import DriveStateIcon from '../DriveStateIcon/DriveStateIcon';
const d3 = window.d3;

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

    const self = this;

    const limit = 65; // speed limit of 65 MPH
    const outerRadius=150;
    const innerRadius=outerRadius - 12;
    const gap = 0.0;

    const startAngle = -0.75 * Math.PI;
    const endAngle = 0.75 * Math.PI;
    const limitAngle = limit / 100 * (endAngle - startAngle) + startAngle;

    // Arc rail of the speed indicator (the grey arc)
    // The arc rail before the speed limit
    const rail1 = d3.svg.arc()
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
    const rail2 = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(0)
      .startAngle(function(d) { return d.startAngle; })
      .endAngle(function(d) { return d.endAngle; });

    const steps = 3;
    const rail2Angle = (endAngle - limitAngle) * 180 / Math.PI;
    const fadeStart = 40;
    const fadeStep = 0.0012;
    const data = d3.range(rail2Angle / steps).map(function(d, i) {
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
    const fanStep = 3;
    const fanRange = 30;
    let percentAngle = startAngle + (this.state.speed + 0.8) / 100 * (endAngle - startAngle);
    const fan = d3.svg.arc()
      .innerRadius(innerRadius * 0.7)
      .outerRadius(innerRadius)
      .startAngle(function(d) { return d.startAngle; })
      .endAngle(function(d) { return d.endAngle; });

    const fanData = ()=> {
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

    const drawFan = () => {
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
    const arcLine = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(3)
      .startAngle(startAngle).endAngle(startAngle + (this.state.speed + 1) / 100 * (endAngle - startAngle));

    const drawSpeedIndct = () => {

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
        const angle = startAngle + (this.state.speed + 1) / 100 * (endAngle - startAngle);
        d3.select('#svg-g').selectAll("path").remove();
        arcLine.endAngle(angle);
        drawSpeedIndct();

        // update shadow fan
        d3.select('#svg-fan').selectAll("path").remove();
        percentAngle = startAngle + (this.state.speed + 0.8) / 100 * (endAngle - startAngle);
        drawFan();

        // update highlight
        const marker = d3.select('#glowMarker');
        if (this.state.speed < limit) {
          marker.attr('display', "none");
        }
        else {
          marker.attr('display', "block");
          const r = (innerRadius + outerRadius) / 2.0;
          const x = r * Math.sin(angle);
          const y = -r * Math.cos(angle);
          marker.attr('transform', `translate(${x}, ${y})`);
        }
      }
    }
  }

  render() {
    let transformStr = "translate(400,250)";
    return (
      <div id='chart'>
        <svg width="800" height="450">
          <g transform={transformStr} id="labelCont">
            <polyline points="-380, -210, 380, -210" style={{stroke:"grey", strokeWidth:0.7}} />
            <text class="topText" transform="translate(-380, -219)" text-anchor="start" >Speedometer at {Math.round(this.state.speed)} mph</text>
            <polyline points="-220, -160, -70, -160, -70, -140" style={{stroke:"grey", strokeWidth:1, strokeDasharray:"2,2"}} />
            <text class="labelText" transform="translate(-310,-157)">SPEED INDICATOR</text>
            <polyline points="240, -160, 100, -160, 100, -125" style={{stroke:"grey", strokeWidth:1, strokeDasharray:"2,2"}} />
            <text class="labelText" transform="translate(360,-157)" text-anchor="end" >SPEED LIMIT INDICATOR</text>
            <polyline points="-220, 160, -170, 160, -170, 130" style={{stroke:"grey", strokeWidth:1, strokeDasharray:"2,2"}} />
            <text class="labelText" transform="translate(-230,163)" text-anchor="end" >DRIVE STATE INDICATOR</text>
            <polyline points="0, 130, 0, 160, 218, 160" style={{stroke:"grey", strokeWidth:1, strokeDasharray:"2,2"}} />
            <text class="labelText" transform="translate(360,160)" text-anchor="end" >FUEL EFFICIENCY INDICATOR</text>
            <rect x="-70" y="80" width="140" height="2" style={{strokeWidth:0,fill:"url(#linearFill)" }} />
          </g>
          <g transform={transformStr} id="svg-back"/>
          <g transform={transformStr} id="svg-fan"/>
          <g transform={transformStr} id="svg-g">
            <defs>
              <filter id="shadow">
                <feDropShadow dx="2" dy="2" stdDeviation="10"/>
              </filter>
              <linearGradient id="linearFill" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stop-color="white" stop-opacity="0"/>
                <stop offset="50%" stop-color="white" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="white" stop-opacity="0"/>
              </linearGradient>
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
            <text class="mphText" text-anchor="middle" alignment-baseline="middle">MPH</text>
          </g>
        </svg>
        <div id="driveCont" style={{left:"400px", top:"250px"}}>
          <p style={{position: "absolute", width:"200px", left:"-46px", top:"76px", color:"white", fontSize: "16px"}}>🍃 <span style={{fontSize: "25px", fontWeight: "500"}}>34</span> MPG</p>
          <div class="driveStates" style={{left:"-190px", top:"-120px"}}><DriveStateIcon stateName="R" currentState={this.state.driveState} /></div>
          <div class="driveStates" style={{left:"-216px", top:"-75px"}}><DriveStateIcon stateName="N" currentState={this.state.driveState} /></div>
          <div class="driveStates" style={{left:"-226px", top:"-20px"}}><DriveStateIcon stateName="D" currentState={this.state.driveState} /></div>
          <div class="driveStates" style={{left:"-216px", top:"35px"}}><DriveStateIcon stateName="P" currentState={this.state.driveState} /></div>
          <div class="driveStates" style={{left:"-190px", top:"80px"}}><DriveStateIcon stateName="B" currentState={this.state.driveState} /></div>
        </div>
      </div>
    )
  }
}