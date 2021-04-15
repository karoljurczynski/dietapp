// IMPORTS

import { React, useEffect, useReducer } from 'react';
import './style/exercise.css';
import './../meal/styles/meal.css';
import '../product_adding_window/styles/productAddingWindow.css';
import AddWindow from '../product_adding_window/ProductAddingWindow';
import RemoveWindow from '../product_removing_window/ProductRemovingWindow';
import MoreWindow from '../MoreWindow/MoreWindow';

const ACTIONS = {
  NEGATE_EXERCISE_OPENED: 'negate-exercise-opened',
  NEGATE_ADD_WINDOW_STATE: 'negate-add-window-state',
  NEGATE_REMOVE_WINDOW_STATE: 'negate-remove-window-state',
  NEGATE_MORE_WINDOW_STATE: 'negate-more-window-state',
  EDIT_SERIE_IN_SERIESLIST: 'edit-serie-in-serieslist',
  CHANGE_NEW_SERIE_DATA: 'change-new-serie-data',
  SET_WARNING: 'set-warning',
  CLEAR_WARNING: 'clear-warning',
  ADD_SERIE: 'add-serie',
  REMOVE_SERIE: 'remove-serie',
  ADD_SERIE_TO_SERIESLIST: 'add-serie-to-serieslist',
  CLEAR_SERIESLIST_BEFORE_DAY_CHANGING: 'clear-serieslist-before-day-change'
}

export const warnings = {
  weight: "Weight must be a positive number",
  reps: "Reps must be a positive number"
};

// COMPONENT

export default function Exercise(props) {

  const initialState = {
    isExerciseOpened: false,
    isAddWindowOpened: false,
    isRemoveWindowOpened: false,
    isMoreWindowOpened: false,
    lastTimeData: { 
      training: { weight: "First time", reps: "First time" },
      serie: { weight: "First time", reps: "First time" } 
    },
    seriesList: [],
    warning: ['', ''],
    newSerie: { id: 0, exerciseId: props.exerciseId, dateIds: { dayId: 0, monthId: 0, yearId: 0 }, serieCount: 'test', weight: '', reps:'' }
  }

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

      case ACTIONS.CHANGE_NEW_SERIE_DATA: {
        switch (action.payload.key) {
          case 'weight':      return { ...state, newSerie: { ...state.newSerie, weight: action.payload.value } };
          case 'reps':        return { ...state, newSerie: { ...state.newSerie, reps:   action.payload.value } };
        }
      }

      case ACTIONS.EDIT_SERIE_COUNT_IN_SERIESLIST: {
        return {...state};
      }

      case ACTIONS.ADD_SERIE: {
        state.newSerie.id = Date.now();
        state.newSerie.dateIds = props.dateIds;
        state.seriesList.push(state.newSerie);
        localStorage.setItem(state.newSerie.id, JSON.stringify(state.newSerie));
        console.log(state.seriesList);
        return {...state, newSerie: { id: 0, exerciseId: props.exerciseId, dateIds: { dayId: 0, monthId: 0, yearId: 0 }, serieCount: '', weight: '', reps: '' }};
      }

      case ACTIONS.REMOVE_SERIE: {
        let newSeriesList = state.seriesList;
        let checkedIdList = action.payload;
        
        checkedIdList.forEach(checkedId => {
          newSeriesList.forEach((serie, index) => {
            if (Number(serie.id) === Number(checkedId)) {
              newSeriesList.splice(index, 1);
              localStorage.removeItem(serie.id);
            }
          });
        });

        return { ...state, seriesList: newSeriesList };
      }

      case ACTIONS.SET_WARNING: {
        switch (action.payload) {
          case 'weight':  return { ...state, warning: [warnings.weight, action.payload] }
          case 'reps':  return { ...state, warning: [warnings.reps, action.payload] }
        };
      }

      case ACTIONS.CLEAR_WARNING: {
        return { ...state, warning: ['', action.payload]};
      }

      case ACTIONS.ADD_SERIE_TO_SERIESLIST: {
        return {...state, seriesList: [...state.seriesList, action.payload]};
      }

      case ACTIONS.CLEAR_SERIESLIST_BEFORE_DAY_CHANGING: {
        return {...state, seriesList: []};
      }

      case ACTIONS.UPDATE_LASTTIME_DATA: {
        return {...state, lastTimeData: {
          training: { weight: state.seriesList[state.seriesList.length - 1].weight,
                      reps: state.seriesList[state.seriesList.length - 1].reps },

          serie: { weight: state.seriesList[state.seriesList.length - 1].weight,
                   reps: state.seriesList[state.seriesList.length - 1].reps }
        }}
      }
      
      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  // LOADS DATA FROM LOCAL STORAGE AFTER DAY CHANGE
  useEffect(() => {
    let localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach(key => {
      let value = JSON.parse(localStorage.getItem(key));
      if (value.exerciseId === props.exerciseId && ((value.dateIds.dayId === props.dateIds.dayId) &&
                                            (value.dateIds.monthId === props.dateIds.monthId) &&
                                            (value.dateIds.yearId === props.dateIds.yearId)))
        dispatch({ type: ACTIONS.ADD_SERIE_TO_SERIESLIST, payload: value });
    });

  }, [props.dateIds]);


  // CLEARS SERIESLIST AFTER DAY CHANGE
  useEffect(() => { 
    return () => dispatch({ type: ACTIONS.CLEAR_SERIESLIST_BEFORE_DAY_CHANGING });

  }, [props.dateIds]);


  // CLOSES WINDOWS AFTER DAY CHANGE
  useEffect(() => {
    const disableVisibilityIfEnabled = (state, action) => {
      if (state)
        dispatch({type: action});
    }
    
    disableVisibilityIfEnabled(state.isExerciseOpened, ACTIONS.NEGATE_EXERCISE_OPENED);
    disableVisibilityIfEnabled(state.isAddWindowOpened, ACTIONS.NEGATE_ADD_WINDOW_STATE);
    disableVisibilityIfEnabled(state.isRemoveWindowOpened, ACTIONS.NEGATE_REMOVE_WINDOW_STATE);
    disableVisibilityIfEnabled(state.isMoreWindowOpened, ACTIONS.NEGATE_MORE_WINDOW_STATE);

  }, [props.dateIds]);

  useEffect(() => {
    state.seriesList.forEach(serie => {

    });

  }, [state.isRemoveWindowOpened]);

  // DISABLES POINTER EVENTS WHEN ONE OF FORM WINDOWS IS OPENED 
  useEffect(() => {
    const changePointerEvents = (value) => {
      const meals = document.querySelectorAll(".meal");
      const wrapper = document.querySelector(".wrapper");
      const center = document.querySelector(".center-section");

      meals.forEach(meal => {
        let buttons = meal.querySelector(".meal__buttons-section");
        buttons.style.pointerEvents = value;
        wrapper.style.pointerEvents = value;

        // DISABLING SCROLL AT CENTER SECTION 
        value === "none" ? center.style.overflowY = "hidden" : center.style.overflowY = "auto";
      });
    }


    state.isAddWindowOpened || state.isRemoveWindowOpened || state.isMoreWindowOpened
    ? changePointerEvents("none")
    : changePointerEvents("auto");
    
  }, [state.isAddWindowOpened, state.isRemoveWindowOpened, state.isMoreWindowOpened]);

  // UPDATES LASTTIMEDATA AFTER CHANGING SERIESLIST
  useEffect(() => {
    if (state.seriesList.length !== 0)
      dispatch({ type: ACTIONS.UPDATE_LASTTIME_DATA });

  }, [state.seriesList]);

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

  const handleFormClearing = () => {
    dispatch({ type: ACTIONS.CHANGE_NEW_SERIE_DATA, payload: { key: 'weight', value: '' }});
    dispatch({ type: ACTIONS.CHANGE_NEW_SERIE_DATA, payload: { key: 'reps', value: '' }});
  }

  const handleOnChange = (e) => {
    // const newReg = /^[1-9]{1,}[.]{1}[0-9]{1,3}/
    const isNumber = /[0-9]/;
    const isZero = /^[0]{1}/;
    getLastTrainingData(23);

    const setValueAsNull = () => {
      dispatch({ type: ACTIONS.CHANGE_NEW_SERIE_DATA, payload: { key: e.target.id, value: "" } });
      dispatch({ type: ACTIONS.SET_WARNING, payload: e.target.id });
    }

    const setValueAsCorrect = () => {
      dispatch({ type: ACTIONS.CHANGE_NEW_SERIE_DATA, payload: { key: e.target.id, value: e.target.value }});
      dispatch({ type: ACTIONS.CLEAR_WARNING, payload: e.target.id });
    }
    
    if (isNumber.test(e.target.value[e.target.value.length - 1])) {

      if (isZero.test(e.target.value))
        setValueAsNull();

      else
        setValueAsCorrect();
    }

    else {
      setValueAsNull();
    }
  }

  const countSerieNumber = (serieId) => {
    let serieNumber = 1;

    for (let i = 0; i < state.seriesList.length; i++) {
      if (state.seriesList[i].id === serieId)
        return serieNumber;
      else
        serieNumber++;
    }
  }

  const countTotalWeight = (seriesList) => {
    let totalWeight = 0;

    seriesList.forEach(serie => {
      totalWeight += Number(serie.weight) * Number(serie.reps);
    });

    return totalWeight;
  }

  const countTotalReps = (seriesList) => {
    let totalReps = 0;

    seriesList.forEach(serie => {
      totalReps += Number(serie.reps);
    });
    
    return totalReps;
  }

  const countWeightPerRepsRatio = (seriesList) => {
    return (countTotalWeight(seriesList) / countTotalReps(seriesList)).toFixed(2);
  }

  const checkIfDateIdsIsDifferent = (firstDateIds, secondDateIds) => {
    if (firstDateIds.dayId !== secondDateIds.dayId)
      return true;
    if (firstDateIds.monthId !== secondDateIds.monthId)
      return true;
    if (firstDateIds.yearId !== secondDateIds.yearId)
      return true;
    else
      return false;
  }
  
  const getLastTrainingData = (serie) => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      let value = JSON.parse(localStorage.getItem(key));

      if (value.exerciseId === props.exerciseId) {

        if (checkIfDateIdsIsDifferent(value.dateIds, props.dateIds)) {

          if (value.id < Date.now()) {

            if (value.serieCount === serie.serieCount) {

              return { weight: value.weight, reps: value.reps}
            }
          }
        }  
      }
    });

  }

  const handleSerieAdding = (e) => {
    e.preventDefault();
    setTimeout(() => { dispatch({ type: ACTIONS.ADD_SERIE }) }, 10);
    dispatch({ type: ACTIONS.NEGATE_ADD_WINDOW_STATE });
  }

  const handleSerieRemoving = (checkedIdsList) => {
    dispatch({ type: ACTIONS.REMOVE_SERIE, payload: checkedIdsList });
    dispatch({ type: ACTIONS.NEGATE_REMOVE_WINDOW_STATE });
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

      { state.seriesList.length !== 0 ? (
        <section className="meal__products-section exercise__series-section" style={ state.isExerciseOpened ? {display: "flex"} : {display: "none"} }>

          <ul className="exercise__series-section__list">
            { state.seriesList.map(serie => {
              return (
              <li key={ serie.id } className="exercise__series-section__list__item">
                  <p className="exercise__series-section__list__item__count">Serie { countSerieNumber(serie.id) }</p>
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
              <p className="exercise__series-section__summary__item__weight">{ countTotalWeight(state.seriesList) } kg</p>
              <p className="exercise__series-section__summary__item__reps">{ countTotalReps(state.seriesList) } reps</p>
            </li>

            <li className="exercise__series-section__summary__item">
              <p className="exercise__series-section__list__item__count">5% more than last time</p>
              <p className="exercise__series-section__list__item__reps exercise__series-section__list__item__reps--stats">{ countWeightPerRepsRatio(state.seriesList) } kg per rep</p>
            </li>

          </ul>
          
        </section>
      ) : null }
      
      
      <section className="meal__buttons-section exercise__buttons-section" style={ state.isExerciseOpened ? {display: "flex"} : {display: "none"} }>

        <button 
          className="adding-window__main__form__tertiary" 
          onClick={ handleMoreWindow }>
          More
        </button>
        
        <div>
          <button 
            className={ state.seriesList.length ? "meal__buttons-section__remove-button" : "meal__buttons-section__remove-button--disabled" }
            onClick={ state.seriesList.length ? handleRemoveWindow : null } 
            disabled={ state.isAddWindowOpened || state.isRemoveWindowOpened ? true : false }>
            Remove
          </button>

          <button 
            className="adding-window__main__form__primary" 
            onClick={ handleAddWindow }
            disabled={ state.isAddWindowOpened || state.isRemoveWindowOpened ? true : false }>
            Add
          </button>
        </div>

      </section>
        
      { state.isAddWindowOpened 
        ? <AddWindow 
            type="exercises"
            handleAddWindow={ handleAddWindow }
            data={{
              weight: state.newSerie.weight,
              reps: state.newSerie.reps
            }}
            warning={ state.warning }
            handleOnChange={ handleOnChange }
            handleFormClearing={ handleFormClearing }
            handleSerieAdding={ handleSerieAdding }
            lastTimeData={ state.lastTimeData }
          />
        : null }

      { state.isRemoveWindowOpened 
        ? <RemoveWindow 
            type="exercises"
            list={ state.seriesList }
            handleRemoving={ handleSerieRemoving }
            handleRemoveWindow={ handleRemoveWindow }
          />
        : null }

      { state.isMoreWindowOpened 
        ? <MoreWindow
            type="exercises"
            handleMoreWindow={ handleMoreWindow }
          />
        : null }

    </div>

  )
}