// IMPORTS

import React from 'react';
import './styles/right.css';


// PRIMARY COMPONENTS

class Gauge extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <div className="gauge-container">
        <GaugeBar percent="42"/>
        <GaugeText />
      </div>

    );
  }
}


// SECONDARY COMPONENTS

class GaugeBar extends React.Component {
  constructor(props) {
    super(props);
  }
  handleRotation() {
    const rotationDegrees = this.props.percent * 2.7;
    if (rotationDegrees < 90)
      return {transform: `rotate(${rotationDegrees}deg)`};
    if (rotationDegrees >= 90 && rotationDegrees < 180)
      return {transform: `rotate(${rotationDegrees}deg)`, borderRightColor: `#ffffff80`};  
    if (rotationDegrees >= 180)
      return {transform: `rotate(${rotationDegrees}deg)`, borderRightColor: `#ffffff80`, borderTopColor: '#ffffff80'};
  }
  render() {
    return (

      <div className="gauge-container__bar" style={this.handleRotation()}>
  
      </div>

    );
  }
}

class GaugeText extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <div className="gauge-container__text">
        <IngredientAmount value="250"/>
        <IngredientName value="proteins"/>
        <IngredientPercent value="50" />
        <IngredientLeftAmount value="250" />
      </div>

    );
  }
}


// TERTIARY COMPONENTS

class IngredientAmount extends React.Component {
  constructor(props) {
    super(props);
    this.unit = '';
  }
  render() {
    return (

      <h4 className="gauge-container__text__amount">{this.props.value}</h4>

    );
  }
}

class IngredientName extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <h6 className="gauge-container__text__name">{this.props.value}</h6>

    );
  }
}

class IngredientPercent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <p className="gauge-container__text__percent">{this.props.value} %</p>

    );
  }
}

class IngredientLeftAmount extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <h5 className="gauge-container__text__left">{this.props.value} left</h5>

    );
  }
}


// EXPORTS

export { Gauge };