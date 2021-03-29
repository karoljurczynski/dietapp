// IMPORTS

import React from 'react';
import './styles/left.css';
import logo from './styles/logo.png';


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

export function Quotation() {

  return (
    <>
      <span className="left-section__quotation-container__top">Be healthy,</span>
      <span className="left-section__quotation-container__bottom">be happy!</span>
    </>
  )
}

export function MenuItem(props) {
  const handleClick = (e) => {
    e.preventDefault();
    props.linkTo(e.target.title);
  }

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