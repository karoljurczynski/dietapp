// IMPORTS

import { React, useState } from 'react';
import logo from './styles/logo.png';
import { FaUser } from 'react-icons/fa';


// COMPONENTS

export function Logo() {
  return (
    <img className="left-section__logo-container__logo" src={logo} alt="Dietapp logo" />
  )
}

export function Title() {
  return (
    <h1 className="left-section__logo-container__title">Diet
      <span className="left-section__logo-container__title__right">app</span>
    </h1>
  )
}

export function Hamburger(props) {
  return (
    <button className="left-section__hamburger" onClick={ props.handleHamburger }>
      <span className="left-section__hamburger__line"></span>
      <span className="left-section__hamburger__line"></span>
      <span className="left-section__hamburger__line"></span>
    </button>
  )
}

export function Quotation() {
  return (
    <>
      <span className="left-section__quotation-container__top">Be healthy,</span>
      <span className="left-section__quotation-container__bottom">be happy!</span>
    </>
  )
}

export function Account(props) {
  const [isLogged, setIsLogged] = useState(props.isLogged);
  const handleClick = (e) => {
    e.preventDefault();
    props.handleAccount();
  }

  return (
    <>
      <button 
        className={ props.isLogged ? "left-section__account left-section__account--logged" : "left-section__account" }
        onClick={ handleClick }>
        <FaUser className="left-section__account__icon"/>
      </button>
    </>
  )
}

export function MenuItem(props) {

  // FUNCTIONS

  const handleClick = (e) => {
    e.preventDefault();
    props.linkTo(e.target.title);
  }

  
  // RETURN

  return (
    <li className="left-section__menu-container__list-item">
        <a 
          className={ props.isActive 
                      ? "left-section__menu-container__list-item__content left-section__menu-container__list-item__content--active" 
                      : "left-section__menu-container__list-item__content" }
          onClick={ handleClick }
          href={ props.href }
          title={ props.value }>{ props.value }</a>
    </li>
  )
}