// IMPORTS

import { React, useState } from 'react';
import './style/exercise.css';
import './../meal/styles/meal.css'


// COMPONENT

export default function Exercise(props) {
  const [isExerciseOpened, setExerciseOpened] = useState(false);

  const handleExerciseOpening = () => {
    setExerciseOpened(!isExerciseOpened)
  }

  return (
    <div className="meal" style={ isExerciseOpened ? {marginLeft: '-10px'} : {marginLeft: '0px'} }>
      <section className="meal__top-section" onClick={ handleExerciseOpening }>

        <h2 className="meal__top-section__meal-title">{ props.name }</h2>

        <div className="meal__top-section__grade-container">
          <span className="meal__top-section__grade-container__point"></span>
          <span className="meal__top-section__grade-container__point"></span>
          <span className="meal__top-section__grade-container__point"></span>
        </div>

      </section>

      <section className="meal__products-section">


      </section>
      
      <section className="meal__buttons-section">

        <button>Add</button>
        <button>Remove</button>

      </section>
    </div>
  )
}