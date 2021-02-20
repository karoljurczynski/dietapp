// IMPORTS

import React, { useCallback } from 'react';
import './styles/right.css';


// PRIMARY COMPONENTS

class Gauge extends React.Component {
  constructor(props) {
    super(props);
  }
  isKcal() {
    if(this.props.isKcal === true)
      return "gauge-container gauge-container--kcal";
    else
      return "gauge-container";
  }
  render() {
    return (

      <div className={this.isKcal()}>
        <GaugeBar percent={this.props.percent} isKcal={this.props.isKcal}/>
        <GaugeText amount={this.props.amount} type={this.props.type} percent={this.props.percent} left={this.props.left} isKcal={this.props.isKcal}/>
      </div>

    );
  }
}


// SECONDARY COMPONENTS

class GaugeBar extends React.Component {
  constructor(props) {
    super(props);
  }
  isKcal() {
    if(this.props.isKcal === true)
      return "gauge-container__bar gauge-container__bar--kcal";
    else
      return "gauge-container__bar";
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

      <div className={this.isKcal()} style={this.handleRotation()}>
  
      </div>

    );
  }
}

class GaugeText extends React.Component {
  constructor(props) {
    super(props);
  }
  isKcal() {
    if(this.props.isKcal === true)
      return "gauge-container__text gauge-container__text--kcal";
    else
      return "gauge-container__text";
  }
  render() {
    return (

      <div className={this.isKcal()}>
        <IngredientAmount value={this.props.amount} isKcal={this.props.isKcal} />
        <IngredientName value={this.props.type} isKcal={this.props.isKcal} />
        <IngredientPercent value={this.props.percent} isKcal={this.props.isKcal} />
        <IngredientLeftAmount value={this.props.left} isKcal={this.props.isKcal} />
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
  isKcal() {
    if(this.props.isKcal === true)
      return "gauge-container__text__amount gauge-container__text__amount--kcal";
    else
      return "gauge-container__text__amount";
  }
  unitChanger() {
    if(this.props.isKcal != true)
      return "g";
  }
  render() {
    return (

      <h4 className={this.isKcal()}>{this.props.value} {this.unitChanger()}</h4>

    );
  }
}

class IngredientName extends React.Component {
  constructor(props) {
    super(props);
  }
  isKcal() {
    if(this.props.isKcal === true)
      return "gauge-container__text__name gauge-container__text__name--kcal";
    else
      return "gauge-container__text__name";
  }
  render() {
    return (

      <h6 className={this.isKcal()}>{this.props.value}</h6>

    );
  }
}

class IngredientPercent extends React.Component {
  constructor(props) {
    super(props);
  }
  isKcal() {
    if(this.props.isKcal === true)
      return "gauge-container__text__percent gauge-container__text__percent--kcal";
    else
      return "gauge-container__text__percent";
  }
  render() {
    return (

      <p className={this.isKcal()}>{this.props.value} %</p>

    );
  }
}

class IngredientLeftAmount extends React.Component {
  constructor(props) {
    super(props);
  }
  isKcal() {
    if(this.props.isKcal === true)
      return "gauge-container__text__left gauge-container__text__left--kcal";
    else
      return "gauge-container__text__left";
  }
  unitChanger() {
    if(this.props.isKcal != true)
      return "g";
  }
  render() {
    return (

      <h5 className={this.isKcal()}>{this.props.value} {this.unitChanger()} left</h5>

    );
  }
}


// EXPORTS

export { Gauge };