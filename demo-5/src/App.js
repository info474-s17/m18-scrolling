import React, { Component } from 'react';
import Scroll from 'react-scroll'
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import * as d3 from 'd3';
import Map from './Map';

"use strict";

// Set up scroll elements
var Link = Scroll.Link;
var DirectLink = Scroll.DirectLink;
var Element = Scroll.Element;
var Events = Scroll.Events;
var scroll = Scroll.animateScroll;
var scrollSpy = Scroll.scrollSpy;

var durationFn = function(deltaTop) {
  return deltaTop;
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.state = {
      data: [],
      shapefile: {
        features: []
      },
      mapVar: 'pct.white.2015'
    }
  }

  componentDidMount() {
    // Get data
    d3.json('./data/seattle-data.json', function(err, data) {
      this.setState({
        data: data
      });
    }.bind(this));

    d3.json("./data/seattle-prepped.json", function(err, shape) {
      this.setState({
        shapefile: JSON.parse(shape)
      });
    }.bind(this))

    // Scroll event
    Events.scrollEvent.register('begin', function() {
      console.log("begin", arguments);
    });

    Events.scrollEvent.register('end', function() {
      console.log("end", arguments);
    });

    scrollSpy.update();

  }

  // Event handler
  handleSetActive(to) {
    switch (to) {
      case 'step1':
        this.setState({
          mapVar: 'pct.white.2015'
        })
        break;
      case 'step2':
        this.setState({
          mapVar: 'home.value.2015'
        });
        break;
      case 'step3':
        this.setState({
          mapVar: 'income.2015'
        });
        break;
    }
  }
  // Scroll to top
  scrollToTop() {
    scroll.scrollToTop();
  }

  // Function to filter data
  filterData() {
    let data = {}
    this.state.data.map(function(d) {
      data[d['geo.id']] = d[this.state.mapVar];
    }.bind(this))
    return data;
  }

  // Stop listening
  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

  // Render function
  render() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li>
                  <Link activeClass="active" onSetActive={ () => this.handleSetActive('step1') } className="test1" to="step1" spy={ true } smooth={ true } duration={ 500 }>Percent White</Link>
                </li>
                <li>
                  <Link activeClass="active" onSetActive={ () => this.handleSetActive('step2') } className="test2" to="step2" spy={ true } smooth={ true } duration={ 500 }>Home Value</Link>
                </li>
                <li>
                  <Link activeClass="active" onSetActive={ () => this.handleSetActive('step3') } className="test3" to="step3" spy={ true } smooth={ true } duration={ 500 }>Income</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Element name="step1" className="element">
          Percent White
        </Element>
        <Element name="step2" className="element">
          Home Value
        </Element>
        <Element name="step3" className="element">
          Income
        </Element>
        <Element name="step4" className="element">
          The end
        </Element>
        <Map data={ this.filterData() } shapefile={ this.state.shapefile } />
        <a onClick={ this.scrollToTop }>To the top!</a>
      </div>
      );
  }
}
;

export default App;