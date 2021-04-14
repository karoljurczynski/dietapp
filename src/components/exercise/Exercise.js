// IMPORTS

import { React, useReducer } from 'react';
import './style/exercise.css';
import './../meal/styles/meal.css';
import '../product_adding_window/styles/productAddingWindow.css';
import AddWindow from '../product_adding_window/ProductAddingWindow';
import RemoveWindow from '../product_removing_window/ProductRemovingWindow';

const ACTIONS = {
  NEGATE_EXERCISE_OPENED: 'negate-exercise-opened',
  NEGATE_ADD_WINDOW_STATE: 'negate-add-window-state',
  NEGATE_REMOVE_WINDOW_STATE: 'negate-remove-window-state',
  NEGATE_MORE_WINDOW_STATE: 'negate-more-window-state'
}

const seriesList = [
  { count: 1, weight: 60, reps: 6 },
  { count: 2, weight: 60, reps: 6 },
  { count: 3, weight: 60, reps: 6 }
];

const initialState = {
  isExerciseOpened: false,
  isAddWindowOpened: false,
  isRemoveWindowOpened: false,
  isMoreWindowOpened: false
}

// COMPONENT

export default function Exercise(props) {

  const reducer = (state, action) => {
    
    switch(action.type) {
      case ACTIONS.NEGATE_EXERCISE_OPENED: {
        return {...state, isExerciseOpened: !state.isExerciseOpened};
      }
      case ACTIONS.NEGATE_ADD_WINDOW_STATE: {
        return {...state, isAddWindowOpened: !state.isAddWindowOpened};
      }
      case ACTIONS.NEGATE_REMOVE_WINDOW_STATE: {
        return {...state, isRemoveWindowOpened: !state.isRemoveWindowOpened};
      }
      case ACTIONS.NEGATE_MORE_WINDOW_STATE: {
        return {...state, isMoreWindowOpened: !state.isMoreWindowOpened};
      }
      
      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleExerciseOpening = () => {
    dispatch({ type: ACTIONS.NEGATE_EXERCISE_OPENED });
  }

  const handleAddWindow = () => {
    dispatch({ type: ACTIONS.NEGATE_ADD_WINDOW_STATE });
  }

  const handleRemoveWindow = () => {
    dispatch({ type: ACTIONS.NEGATE_REMOVE_WINDOW_STATE });
  }

  const handleMoreWindow = () => {
    dispatch({ type: ACTIONS.NEGATE_MORE_WINDOW_STATE });
  }

  return (
    <div className="meal exercise" style={ state.isExerciseOpened ? {marginLeft: '-10px'} : {marginLeft: '0px'} }>
      
      <section className="meal__top-section exercise__top-section" onClick={ handleExerciseOpening }>

        <h2 className="meal__top-section__meal-title">{ props.name }</h2>

        <div className="exercise__top-section__grade-container">
          <span className="exercise__top-section__grade-container__point"></span>
          <span className="exercise__top-section__grade-container__point"></span>
          <span className="exercise__top-section__grade-container__point"></span>
        </div>

      </section>

      <section className="meal__products-section exercise__series-section" style={ state.isExerciseOpened ? {display: "flex"} : {display: "none"} }>

      <ul className="exercise__series-section__list">
        { seriesList.map(serie => {
          return (
           <li className="exercise__series-section__list__item">
              <p className="exercise__series-section__list__item__count">Serie { serie.count }</p>
              <p className="exercise__series-section__list__item__weight">{ serie.weight } kg</p>
              <p className="exercise__series-section__list__item__reps">{ serie.reps } reps</p>
            </li> 
          )
          })
        }
      </ul>

      <ul className="exercise__series-section__summary">

        <li className="exercise__series-section__summary__item">
          <p className="exercise__series-section__summary__item__count">Total</p>
          <p className="exercise__series-section__summary__item__weight">1080 kg</p>
          <p className="exercise__series-section__summary__item__reps">18 reps</p>
        </li>

        <li className="exercise__series-section__summary__item">
          <p className="exercise__series-section__list__item__count">5% more than last time</p>
        </li>

      </ul>
      
      </section>
      
      <section className="meal__buttons-section exercise__buttons-section" style={ state.isExerciseOpened ? {display: "flex"} : {display: "none"} }>

        <button className="adding-window__main__form__tertiary">More</button>
        
        <div>
          <button className={ seriesList.length ? "meal__buttons-section__remove-button" : "meal__buttons-section__remove-button--disabled" }>Remove</button> 
          <button className="adding-window__main__form__primary" onClick={ handleAddWindow }>Add</button>
        </div>

      </section>
        
      { state.isAddWindowOpened 
        ? <AddWindow 
            handleAddingWindow={ handleAddWindow } 
          />
        : null }

      { state.isRemoveWindowOpened 
        ? <RemoveWindow 
            handleRemovingWindow={ handleRemoveWindow }
          />
        : null }

      { state.isMoreWindowOpened 
        ? <RemoveWindow
            handleRemovingWindow={ handleMoreWindow }
          />
        : null }

    </div>

  )
}