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

      <div className="right-section__gauge-container">
        <GaugeBar />
        <GaugeText />
      </div>

    );
  }
}
class Gauges extends React.Component {
  constructor(props) {
    super(props);
  }
  handleRotation() {
    const rotationDegrees = this.props.percent * 2.7;
    if (rotationDegrees < 90)
      return {transform: `rotate(${rotationDegrees}deg)`};
    if (rotationDegrees >= 90 && rotationDegrees < 180)
      return {transform: `rotate(${rotationDegrees}deg)`, borderRightColor: `#ffe01c`};  
    if (rotationDegrees >= 180)
      return {transform: `rotate(${rotationDegrees}deg)`, borderRightColor: `#ffe01c`, borderTopColor: '#ffe01c'};
  }
  render() {
    return (
      <div className="graph__container">
        <div className="graph__container__background" style={this.handleRotation()}></div>
        <div className="graph__container__data">
          <div className="graph__container__data__value">{this.props.value + "g"}</div>
          <div className="graph__container__data__type">{this.props.type}</div>
          <div className="graph__container__data__percent">{this.props.percent + "%"}</div>
          <div className="graph__container__data__left">{this.props.left + "g left"}</div>
        </div>
      </div>
    );
  }
}



// SECONDARY COMPONENTS

class GaugeBar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <div className="right-section__gauge-container__bar">
  
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

      <div className="right-section__gauge-container__text">
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

      <h4 className="right-section__gauge-container__text__amount">{this.props.value}</h4>

    );
  }
}

class IngredientName extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <h6 className="right-section__gauge-container__text__name">{this.props.value}</h6>

    );
  }
}

class IngredientPercent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <p className="right-section__gauge-container__text__percent">{this.props.value} %</p>

    );
  }
}

class IngredientLeftAmount extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <h5 className="right-section__gauge-container__text__left">{this.props.value} left</h5>

    );
  }
}


// EXPORTS

export { Gauge };