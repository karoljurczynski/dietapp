// IMPORTS

import React from 'react';
import './styles/center.css';



// COMPONENTS

export default function DateChanger() {
  
  return (
    <div className="center-section__top__date-changer">

      <button className="center-section__top__date-changer__previous-button">previous</button>
      <h4 className="center-section__top__date-changer__current-date">23.03.2021</h4>
      <button className="center-section__top__date-changer__next-button">next</button>

    </div>
  )
}