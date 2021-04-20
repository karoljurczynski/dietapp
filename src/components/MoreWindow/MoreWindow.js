import { React, useEffect } from 'react';
import './../product_removing_window/styles/productRemovingWindow.css';
import './styles/moreWindow.css';
 
export default function MoreWindow(props) {
  // ENABLE POINTER EVENTS IN WINDOW AFTER MOUNTING
  useEffect(() => { 
    const removingWindow = document.querySelector(".removing-window");
    removingWindow.style.pointerEvents = "auto";

   }, []);

  const handleBackButton = () => {
    props.handleMoreWindow();
  }

  return (
    <section className="removing-window more-window">

      <h1 className="removing-window__title">{ props.title }</h1>

      <main className="removing-window__main">

        <section className="more-window__section">
          <h3 className="more-window__section__title">Description</h3>
          <p className="more-window__section__paragraph">{ props.description }</p>
        </section>

        <section className="more-window__section more-window__section--horizontal">
          <div className="more-window__section--horizontal__left">
            <h3 className="more-window__section__title">Difficulty</h3>
            <div className="exercise__top-section__grade-container" style={{marginBottom: "15px"}}>
              <span className="exercise__top-section__grade-container__point exercise__top-section__grade-container__point--filled"></span>
              <span className={ props.difficulty >= 2 ? "exercise__top-section__grade-container__point exercise__top-section__grade-container__point--filled" : "exercise__top-section__grade-container__point" }></span>
              <span className={ props.difficulty === 3 ? "exercise__top-section__grade-container__point exercise__top-section__grade-container__point--filled" : "exercise__top-section__grade-container__point" }></span>
            </div>
            <p className="more-window__section__paragraph">{ props.typeOfExercise }</p>
          </div>

          <div className="more-window__section--horizontal__right">
            <h3 className="more-window__section__title">Muscles</h3>
            <ul className="more-window__section__list">
              { props.muscles.map( muscle => { return <li className="more-window__section__list__item">{ muscle }</li> }) } 
            </ul>
          </div>
        </section>

        <section className="more-window__section">
          <h3 className="more-window__section__title">Proper form</h3>
          <iframe allowFullScreen width="100%" height="300px" src={ props.properFormLink }></iframe>
        </section>

        <section className="removing-window__main__list__buttons-section removing-window__main__list__buttons-section--more">
          <button 
            className={ "removing-window__main__list__buttons-section__primary" }
            onClick={ handleBackButton }>
            Back
          </button>
        </section>

      </main>

    </section>
  )
}