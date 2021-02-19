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

      <header className="logo-container">
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

      <ul className="menu-container">
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

      <h2 className="quotation">
        <span className="quotation__top">Be healthy,</span>
        <span className="quotation__bottom">be happy!</span>
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

      <img className="logo-container__logo" src={logo} alt="Dietapp logo" />

    );
  }
}

class Title extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <h1 className="logo-container__title">Diet
        <span className="logo-container__title__right">app</span>
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
      return "menu-container__list-item__content left-section__menu-container__list-item__content--active";
    else
      return "menu-container__list-item__content";
  }
  render() {
    return (

      <li className="menu-container__list-item">
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