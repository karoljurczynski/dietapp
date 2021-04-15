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
    <section className="removing-window">

      <h1 className="removing-window__title">More info</h1>

      <main className="removing-window__main">

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