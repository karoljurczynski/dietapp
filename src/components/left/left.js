// IMPORTS

import React from 'react';
import './styles/left.css';
import logo from './styles/logo.png';

// PRIMARY COMPONENTS

class LogoContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <header className="left-section__logo-container">
        <Logo />
        <Title />
      </header>

    );
  }
}

class MenuContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <ul className="left-section__menu-container">
        <ListItem value="Log in" href="#" isActive={true} />
        <ListItem value="Settings" href="#" isActive={false} />
        <ListItem value="Training" href="#" isActive={false} />
        <ListItem value="About" href="#" isActive={false} />
      </ul>

    );
  }
}

class Quotation extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <h2 className="left-section__quotation">
        <span className="left-section__quotation__top">Be healthy,</span>
        <span className="left-section__quotation__bottom">be happy!</span>
      </h2>

    );
  }
}

// SECONDARY COMPONENTS

class Logo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <img className="left-section__logo-container__logo" src={logo} alt="Dietapp logo" />

    );
  }
}

class Title extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <h1 className="left-section__logo-container__title">Diet
        <span className="left-section__logo-container__title left-section__logo-container__title--right">app</span>
      </h1>

    );
  }
}

class ListItem extends React.Component {
  constructor(props) {
    super(props);
  }
  isActive() {
    if (this.props.active === true)
      return "left-section__menu-container__list-item__content left-section__menu-container__list-item__content--active";
    else
      return "left-section__menu-container__list-item__content";
  }
  render() {
    return (

      <li className="left-section__menu-container__list-item">
          <a 
            className={this.isActive()}
            href={this.props.href}
            title={this.props.value}>{this.props.value}</a>
      </li>

    );
  }
}

// EXPORTS

export { LogoContainer, MenuContainer, Quotation };