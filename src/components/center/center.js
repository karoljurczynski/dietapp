// IMPORTS

import React from 'react';
import './styles/center.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
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
        <Meal 
          title="Breakfast" 
          proteins={this.props.proteinsSummary}
          fats={this.props.fatsSummary}
          carbs={this.props.carbsSummary}
          kcal={this.props.kcalSummary}
          />
        <Meal title="Snack" />
        <Meal title="Lunch" />
        <Meal title="Snack II" />
        <Meal title="Dinner" />
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
        <DateButton className="top__date-changer__previous-button" icon={<FontAwesomeIcon icon={faArrowCircleLeft} />}/>
        <h4 className="top__date-changer__day">{this.props.currentDay}</h4>
        <DateButton className="top__date-changer__next-button" icon={<FontAwesomeIcon icon={faArrowCircleRight} />}/>
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

      <button className={this.props.className}>{this.props.icon}</button>

    );
  }
}


// EXPORTS

export { TopCenterSection, MainContent };