// IMPORTS

import { React, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaChevronCircleLeft } from 'react-icons/fa';
 

// COMPONENT

export default function MoreWindow(props) {

  // EFFECTS

  // BLURING AND DISABLING POINTER EVENTS ON BACKGROUND AND DELAYING AN IFRAME AFTER MOUNTING
  useEffect(() => {
    const wrapper = document.querySelector(".wrapper");
    const iframe = document.querySelector(".window__main__section__iframe");
    const rootElement = document.querySelector("#root");
    const hamburger = document.querySelector(".left-section__hamburger");
    wrapper.style.filter = "blur(5px) opacity(40%) grayscale(100%)";
    wrapper.style.pointerEvents = "none";
    setTimeout(() => { iframe.style.opacity = "1" }, 500);
    rootElement.style.zIndex = 97;
    hamburger.style.display = "none";
  
    return (() => {
      wrapper.style.filter = "blur(0px) opacity(100%) grayscale(0%)";
      wrapper.style.pointerEvents = "auto";
      rootElement.style.zIndex = 99;
      if (window.innerWidth < 769)
        hamburger.style.display = "block";
    })

  }, []);


  // FUNCTIONS

  const handleBackButton = () => {
    props.handleMoreWindow();
  }


  // RETURN

  return ReactDOM.createPortal (
    <>
    <div className="window__closer" onClick={ handleBackButton }></div> 
    <div className="window window--more">

      <header className="window__header">
        <h2 className="window__header__heading">{ props.title }</h2>
        <button className="window__header__back-button" onClick={ handleBackButton }><FaChevronCircleLeft /></button>
      </header>

      <main className="window__main">

        <section className="window__main__section"> 
          <h3 className="window__main__section__title">Description</h3>
          <p className="window__main__section__text">{ props.description }</p>
        </section>

        <section className="window__main__section window__main__section--halfed">
          <aside className="window__main__section__split-left">
            <h3 className="window__main__section__title">Difficulty</h3>
            <div className="exercise__top-section__grade-container" style={{ marginBottom: "15px" }}>
              <span className="exercise__top-section__grade-container__point exercise__top-section__grade-container__point--filled"></span>
              <span className={ props.difficulty >= 2 ? "exercise__top-section__grade-container__point exercise__top-section__grade-container__point--filled" : "exercise__top-section__grade-container__point" }></span>
              <span className={ props.difficulty === 3 ? "exercise__top-section__grade-container__point exercise__top-section__grade-container__point--filled" : "exercise__top-section__grade-container__point" }></span>
            </div>
            <p className="window__main__section__text">{ props.typeOfExercise }</p>
          </aside>
          <aside className="window__main__section__split-right">
            <h3 className="window__main__section__title">Muscles</h3>
            <ul className="window__main__section__list">
              { props.muscles.map((muscle, index) => { return <li key={ index } className="window__main__section__list__item">{ muscle }</li> }) } 
            </ul>
          </aside>
        </section>

        <section className="window__main__section">
          <h3 className="window__main__section__title">Proper form</h3>
          <iframe className="window__main__section__iframe" allowFullScreen width="100%" height="300px" src={ props.properFormLink }></iframe>
        </section>

      </main>

      <section className="window__bottom">
        <div></div>
        <button className="window__bottom__primary-button" type="button" onClick={ handleBackButton }>Back</button>
      </section>

    </div>
    </>,
    document.getElementById('portal')
  )
}