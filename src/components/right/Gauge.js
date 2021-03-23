// IMPORTS

import React from 'react';
import './styles/right.css';


// PRIMARY COMPONENTS

export default function Gauge(props) {
  const handleRotation = () => {
    const rotationDegrees = props.percent * 2.7;
    if (rotationDegrees < 90)
      return {transform: `rotate(${rotationDegrees}deg)`};
    if (rotationDegrees >= 90 && rotationDegrees < 180)
      return {transform: `rotate(${rotationDegrees}deg)`, borderRightColor: `#ffffff80`};  
    if (rotationDegrees >= 180)
      return {transform: `rotate(${rotationDegrees}deg)`, borderRightColor: `#ffffff80`, borderTopColor: '#ffffff80'};
  }

  return (

    <div className={ !props.isKcal ? "right-section__gauge-container" : "right-section__gauge-container right-section__gauge-container--kcal" }>
        
        <div className={ !props.isKcal ? "right-section__gauge-container__bar" : "right-section__gauge-container__bar right-section__gauge-container__bar--kcal" } 
          style={handleRotation()}>    
        </div>

        <div className={ !props.isKcal ? "right-section__gauge-container__text" : "right-section__gauge-container__text right-section__gauge-container__text--kcal" }>
           <h4 className={ !props.isKcal ? "right-section__gauge-container__text__amount" : "right-section__gauge-container__text__amount right-section__gauge-container__text__amount--kcal" }>
             {props.amount} </h4>
           <h6 className={ !props.isKcal ? "right-section__gauge-container__text__name" : "right-section__gauge-container__text__name right-section__gauge-container__text__name--kcal" }>
             {props.name} </h6>
           <p className={ !props.isKcal ? "right-section__gauge-container__text__percent" : "right-section__gauge-container__text__percent right-section__gauge-container__text__percent--kcal" }>
             {props.percent} %</p>
           <h5 className={ !props.isKcal ? "right-section__gauge-container__text__left" : "right-section__gauge-container__text__left right-section__gauge-container__text__left--kcal" }>
             {props.left} left</h5>
        </div>

    </div>
  )
}