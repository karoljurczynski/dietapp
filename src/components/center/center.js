// IMPORTS

import React from 'react';
import './styles/center.css'
import previousIcon from './styles/previousIcon.png';
import nextIcon from './styles/nextIcon.png';
import { Meal } from '../meal/meal';


// PRIMARY COMPONENTS

class TopCenterSection extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="top">
        <SectionTitle />
        <DateChanger currentDay="Today"/>
      </section>

    );
  }
}

class MainContent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="main">
        <Meal title="Posiłek 1" />
        <Meal title="Posiłek 2" />
        <Meal title="Posiłek 3" />
        <Meal title="Posiłek 4" />
        <Meal title="Posiłek 5" />
      </section>

    );
  }
}


// SECONDARY COMPONENTS

class SectionTitle extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <h3 className="top__title">Dashboard</h3>

    );
  }
}

class DateChanger extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <div className="top__date-changer">
        <DateButton className="top__date-changer__previous-button" iconSrc={previousIcon}/>
        <h4 className="top__date-changer__day">{this.props.currentDay}</h4>
        <DateButton className="top__date-changer__next-button" iconSrc={nextIcon}/>
      </div>

    );
  }
}


// TERTIARY COMPONENTS

class DateButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <button className={this.props.className}><img src={this.props.iconSrc} /></button>

    );
  }
}


// EXPORTS

export { TopCenterSection, MainContent };