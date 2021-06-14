// IMPORTS

import { React, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaChevronCircleLeft } from 'react-icons/fa';
import logo from '../../logo.png';


// COMPONENT

export default function About({ previousPage, closeWindow }) {

  // EFFECTS

  // BLURING AND DISABLING POINTER EVENTS ON BACKGROUND AFTER MOUNTING
  useEffect(() => {
    const wrapper = document.querySelector(".wrapper");
    const rootElement = document.querySelector("#root");
    const hamburger = document.querySelector(".left-section__hamburger");
    const accountIcon = document.querySelector(".left-section__account");
    wrapper.style.filter = "blur(5px) opacity(40%) grayscale(100%)";
    wrapper.style.pointerEvents = "none";
    rootElement.style.zIndex = 97;
    hamburger.style.display = "none";
    accountIcon.style.display = "none";
    
    return (() => {
      wrapper.style.filter = "blur(0px) opacity(100%) grayscale(0%)";
      wrapper.style.pointerEvents = "auto";
      rootElement.style.zIndex = 99;
      
      if (window.innerWidth < 769)
        hamburger.style.display = "flex";
        accountIcon.style.display = "flex";
    })

  }, []);


  // FUNCTIONS

  const handleBackToPreviousPage = (e) => {
    e.preventDefault();
    closeWindow();
  }


  // RETURN

  return ReactDOM.createPortal (
    <>
    <div className="window__closer" onClick={ handleBackToPreviousPage }></div> 
    <div className="window">

      <header className="window__header">
        <h2 className="window__header__heading">About</h2>
        <button className="window__header__back-button" onClick={ handleBackToPreviousPage }><FaChevronCircleLeft /></button>
      </header>

      <main className="window__main">
        <section className="window__main__section">
          <img className="window__main__section__logo" src={ logo } alt="Dietapp logo"></img>
          <h1 className="left-section__logo-container__title">Diet
            <span className="left-section__logo-container__title__right">app</span>
          </h1>
        </section>
        <section className="window__main__section"> 
          <h3 className="window__main__section__title">Info</h3>
          <p className="window__main__section__text">The Dietapp is a complex nutrition and training organizer.
           Made to improve my skills in creating web apps using React,
           React Hooks, SCSS and Firebase.</p>
        </section>

        <section className="window__main__section"> 
          <h3 className="window__main__section__title">Features</h3>
          <p className="window__main__section__text">You can manually set your daily demand as well as your exercises
           which you are doing on training. An app saves data you entered
           and makes a several operations on these like counting macronutrients,
           progression made in training, or just storing these for any time you want.</p>
        </section>

        <section className="window__main__section"> 
          <h3 className="window__main__section__title">Idea</h3>
          <p className="window__main__section__text">Whole idea of the app is about my main hobby which are dietetics and
           bodybuilding. After 3 years of being a fit, I have included the most useful
           features to control your fit life.</p>
        </section>

        <section className="window__main__section" style={{ marginTop: "40px" }}>
          <h3 className="window__main__section__text">© 2021 Karol Jurczyński</h3>
        </section>
      </main>

      <section className="window__bottom">
        <div></div>
        <button className="window__bottom__primary-button" type="button" onClick={ handleBackToPreviousPage }>Back</button>
      </section>

    </div>
    </>,
    document.getElementById('portal')
  )
}