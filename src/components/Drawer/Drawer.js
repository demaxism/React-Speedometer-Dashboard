import React, { Component } from 'react';
import './Drawer.css';
let d3 = window.d3;

export default class Drawer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      speed : 1,
      count : 0,
    }
  }

  componentDidMount() {

    var outerRadius=150;
    var innerRadius=outerRadius - 12;
    var cornerRadius = 3;
    var gap = 0.0;

    var limit = 65;

    var startAngle = -0.75 * Math.PI;
    var endAngle = 0.75 * Math.PI;
    var limitAngle = limit / 100 * (endAngle - startAngle) + startAngle;
    console.log(" a " + limitAngle);

    var svg=d3.select('#svg-g');

    // back arc
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

    var rail2 = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(0)
      .startAngle(function(d) { return d.startAngle; })
      .endAngle(function(d) { return d.endAngle; });

    var steps = 3;
    var rail2Angle = (endAngle - limitAngle) * 180 / Math.PI; // ~~ 90
    var fadeStart = 40;
    var fadeStep = 0.0012;
    var data = d3.range(rail2Angle / steps).map(function(d, i) {
      console.log(i);
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

    // fan shade
    var fanStep = 3;
    var fanRange = 30;
    var percentAngle = startAngle + (this.state.speed - 0.2) / 100 * (endAngle - startAngle);
    var fan = d3.svg.arc()
      .innerRadius(innerRadius * 0.7)
      .outerRadius(innerRadius)
      .startAngle(function(d) { return d.startAngle; })
      .endAngle(function(d) { return d.endAngle; });

    var fanData = ()=> {
      return d3.range(fanRange).map(function(d, i) {
        var pass = i * fanStep;
        return {
          startAngle: percentAngle - pass * (Math.PI / 180),
          endAngle:Math.max(startAngle, percentAngle - (pass + fanStep) * (Math.PI / 180)),
          fill: d3.hsl(200, 0.8, 0.2 - i * 0.007).toString()
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

    // arc
    var arcLine = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(3)
      .startAngle(startAngle).endAngle(startAngle + this.state.speed / 100 * (endAngle - startAngle));

    var speedIndicator = d3.select('#svg-g').append('path')
    .datum({endAngle:0})
    .attr({
        d: arcLine,
        id: 'arcguide'
    })
    .style({
      fill:'url(#gradient)',
      filter: 'url(#dropGlow)',
    });

    var drawSpeedIndct = () => {
      d3.select('#svg-g').append('path')
      .datum({endAngle:0})
      .attr({
          d: arcLine,
          id: 'arcguide'
      })
      .style({
        fill:'url(#gradient)',
        filter: 'url(#dropGlow)',
      });
    }
    drawSpeedIndct();

    var update = () => {
      this.setState({count : this.state.count + 1});

      if (this.state.speed < 100) {
        this.setState({ speed : this.state.speed + 0.5 });
        var angle = startAngle + this.state.speed / 100 * (endAngle - startAngle);
        d3.select('#svg-g').selectAll("path").remove();
        arcLine.endAngle(angle);
        drawSpeedIndct();

        d3.select('#svg-fan').selectAll("path").remove();
        percentAngle = startAngle + (this.state.speed - 0.2) / 100 * (endAngle - startAngle);
        drawFan();
      }
      
      // console.log("update " + this.state.count);
      window.requestAnimationFrame(update);
    }
    update();
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
            <circle r="25" id="glowMarker" fill="#c9dcff" filter="url(#softGlow)"></circle>
            <text class="counterText" text-anchor="middle" alignment-baseline="middle">{Math.round(this.state.speed)}</text>
          </g>
          
        </svg>
      </div>
    )
  }
}