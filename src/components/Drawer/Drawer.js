import React, { Component } from 'react';
import './Drawer.css';
let d3 = window.d3;

export default class Drawer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      speed : 10
    }
  }

  componentDidMount() {
    var percent = 65;
    var oldValue=0;
    var ratio=percent/100;
    var glowRadius = 25;

    var outerRadius=150;
    var innerRadius=outerRadius - 12;
    var cornerRadius = 3;
    var gap = 0.01;

    var limit = 65;

    var startAngle = -0.75 * Math.PI;
    var endAngle = 0.75 * Math.PI;
    var limitAngle = limit / 100 * (endAngle - startAngle) + startAngle;
    console.log(" a " + limitAngle);

    var svg=d3.select('#svg-g');

    // back arc
    var rail1=d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(0)
      .startAngle(startAngle).endAngle(limitAngle - gap);

    var pathBackground=svg.append('path')
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

    var steps = 5;
    var rail2Angle = (endAngle - limitAngle) * 180 / Math.PI; // ~~ 90
    var fadeStart = 40;
    var fadeStep = 0.0012;
    var data = d3.range(rail2Angle / steps).map(function(d, i) {
      console.log(i);
      var pass = i * steps;
      console.log(" s:" + (limitAngle + pass * (Math.PI / 180)));
      console.log(" e:" + (limitAngle + (pass + steps) * (Math.PI / 180)));
      return {
        flag: i,
        startAngle: limitAngle + pass * (Math.PI / 180),
        endAngle: limitAngle + (pass + steps) * (Math.PI / 180),
        fill: d3.hsl(0, 0, .13 - Math.max(pass - fadeStart, 0) * fadeStep).toString()
      };
    });

    svg.selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr('d', rail2)
      .attr("stroke-width", 1)
      .attr("flag", function(d) { return d.flag;})
      .attr("stroke", function(d) { return d.fill;})
      .attr("fill", function(d) { return d.fill; });

    // red arc
    var arcLine=d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(4)
      .startAngle(startAngle).endAngle(-0.3 * Math.PI);

    var pathForeground=svg.append('path')
    .datum({endAngle:0})
    .attr({
        d: arcLine,
        id: 'arcguide'
    })
    .style({
      // fill: '#f14254',
      fill:'url(#gradient)',
      filter: 'url(#dropGlow)',
    });
    
    pathForeground.endAngle = 3.5;

  }

  render() {
    return (
      <div id='chart'>
        <svg width="700" height="400">
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
                  <stop offset="0%" stop-color="#CA011F"></stop>
                  <stop offset="100%" stop-color="#f14254"></stop>
              </linearGradient>
              <filter id="dropGlow" height="3100%" width="3100%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
                <feColorMatrix
                type = "matrix"
                values="0.95     0     0     0     0
                        0     0.26     0     0     0
                        0     0     0.33     0     0
                        0     0     0     1     0 "/>
                <feOffset in="bluralpha" dx="0.000000" dy="0.000000" result="offsetBlur"/>
                <feMerge>
                    <feMergeNode in="offsetBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="softGlow" height="100" width="100" x="-1000%" y="-1000%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="20"></feGaussianBlur>
              </filter>
            </defs>
            <circle r="25" id="glowMarker" fill="#eb384b" filter="url(#softGlow)"></circle>
            <text class="counterText" text-anchor="middle" alignment-baseline="middle">{this.state.speed}</text>
          </g>
        </svg>
      </div>
    )
  }
}