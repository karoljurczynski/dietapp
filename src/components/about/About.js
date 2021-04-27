import React from 'react';
import '../meal/styles/meal.css';

export default function About() {
  return (
    <div className="meal">

      <section className="meal__top-section">
        <h2 className="meal__top-section__meal-title">Info</h2>        
      </section>
      <section className="meal__products_section">
        <p className="meal__paragraph">The Dietapp is a complex nutrition and training organizer.
           Made to improve my skills in creating web apps using React,
           React Hooks, SCSS and Firebase.</p>
      </section>

      <section className="meal__top-section">
        <h2 className="meal__top-section__meal-title">Features</h2>        
      </section>
      <section className="meal__products_section">
        <p className="meal__paragraph">You can manually set your daily demand as well as your exercises
           which you are doing on training. An app saves data you entered
           and makes a several operations on these like counting macronutrients,
           progression made in training, or just storing these for any time you want.</p>
      </section>

      <section className="meal__top-section">
        <h2 className="meal__top-section__meal-title">Idea</h2>        
      </section>
      <section className="meal__products_section">
        <p className="meal__paragraph">Whole idea of the app is about my main hobby which are dietetics and
           bodybuilding. After 3 years of being a fit, I have included the most useful
           features to control your fit life.</p>
      </section>

      <p className="meal__copyright">© 2021 Karol Jurczyński</p>
    </div>
  )
}