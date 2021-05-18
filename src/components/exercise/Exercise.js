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
  SORT_SERIESLIST: 'sort-serieslist',
  CHANGE_NEW_SERIE_DATA: 'change-new-serie-data',
  UPDATE_LASTTIME_DATA: 'update-lasttime-data',
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
    newSerie: { id: 0, exerciseId: props.exerciseId, trainingId: 0, dateIds: { dayId: 0, monthId: 0, yearId: 0 }, serieCount: '', weight: '', reps:'' }
  }

  const getPreviousTrainingDate = (previousDateIds) => {
    const isLeapYear = () => {
      if (((previousDateIds.yearId % 4 === 0) && (previousDateIds.yearId % 100 !== 0)) || previousDateIds.yearId % 400 === 0)
         return true;
      
      else
         return false;
    }
    const isDayFirstInMonth = () => {
      if(previousDateIds.dayId === 1)
        return true;
      else
        return false;
    }
    const isDayFirstInJanuary = () => {
      if ((previousDateIds.dayId === 1) && (previousDateIds.monthId === 1))
        return true;
      
      else
        return false;
    }
    const isDayFirstInMarch = () => {
      if ((previousDateIds.dayId === 1) && (previousDateIds.monthId === 3))
        return true;
      
      else
        return false;
    }
    const isDayFirstIn30DayMonths = () => {
      if ((previousDateIds.dayId === 1) && ((previousDateIds.monthId === 4) || (previousDateIds.monthId === 6) || (previousDateIds.monthId === 8) || (previousDateIds.monthId === 9) || (previousDateIds.monthId === 11)))
        return true;
      
      else
        return false;
    }

    let potentialPreviousDateIds = { dayId: 0, monthId: 0, yearId: 0 };

    if (isDayFirstInJanuary()) {
      potentialPreviousDateIds.dayId = 31;
      potentialPreviousDateIds.monthId = 12;
      potentialPreviousDateIds.yearId = previousDateIds.yearId - 1;
    }

    else if (isDayFirstInMarch()) {
      if(isLeapYear())
        potentialPreviousDateIds.dayId = 29;
      else
        potentialPreviousDateIds.dayId = 28;
      
      potentialPreviousDateIds.monthId = 2;
      potentialPreviousDateIds.yearId = previousDateIds.yearId;
    }

    else if (isDayFirstIn30DayMonths()) {
      potentialPreviousDateIds.dayId = 31;
      potentialPreviousDateIds.monthId = previousDateIds.monthId - 1;
      potentialPreviousDateIds.yearId = previousDateIds.yearId;
    }

    else if (isDayFirstInMonth()) {
      potentialPreviousDateIds.dayId = 30
      potentialPreviousDateIds.monthId = previousDateIds.monthId - 1;
      potentialPreviousDateIds.yearId = previousDateIds.yearId;
    }
    
    else {
      potentialPreviousDateIds.dayId = previousDateIds.dayId - 1;
      potentialPreviousDateIds.monthId = previousDateIds.monthId;
      potentialPreviousDateIds.yearId = previousDateIds.yearId;
    }

    return potentialPreviousDateIds;
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

      case ACTIONS.ADD_SERIE: {
        const updatedSeriesList = state.seriesList;
        let serieCount = 1;
        
        // ADDING SERIE TO SERIESLIST
        state.newSerie.id = Date.now();
        state.newSerie.dateIds = props.dateIds;
        updatedSeriesList.push(state.newSerie);

        // SERIE ORDER COUNTING
        updatedSeriesList.forEach(serie => {
          serie.serieCount = serieCount;
          serieCount++;
        });

        // SAVING CHANGES IN LOCAL STORAGE
        localStorage.setItem(state.newSerie.id, JSON.stringify(state.newSerie));
        
        return {
          ...state,
          newSerie: { id: 0, exerciseId: props.exerciseId, dateIds: { dayId: 0, monthId: 0, yearId: 0 }, serieCount: '', weight: '', reps: '' },
          seriesList: updatedSeriesList };
      }

      case ACTIONS.REMOVE_SERIE: {
        let updatedSeriesList = state.seriesList;
        let checkedIdList = action.payload;
        let serieCount = 1;
        
        checkedIdList.forEach(checkedId => {

          updatedSeriesList.forEach((serie, index) => {
            localStorage.removeItem(serie.id);
            if (Number(serie.id) === Number(checkedId))
              updatedSeriesList.splice(index, 1);
              
          });

        });

        // SERIE ORDER COUNTING
        updatedSeriesList.forEach(serie => {
          serie.serieCount = serieCount;
          localStorage.setItem(serie.id, JSON.stringify(serie));
          serieCount++;
        });

        return { ...state, seriesList: updatedSeriesList };
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

      case ACTIONS.SORT_SERIESLIST: {
        let serieCount = 1;
        const updatedSeriesList = [];

        while (updatedSeriesList.length !== state.seriesList.length) {

          state.seriesList.forEach(serie => {
            if (serie.serieCount === serieCount)
              updatedSeriesList.push(serie);
          });

          serieCount++;
        }
   
        return {...state, seriesList: updatedSeriesList };
      }

      case ACTIONS.CLEAR_SERIESLIST_BEFORE_DAY_CHANGING: {
        return {...state, seriesList: []};
      }

      case ACTIONS.UPDATE_LASTTIME_DATA: {

        let currentlyAddingSerieNumber = 0;
        let indexOfLastSerie = 0;
        let updatedLastSerieData = { weight: "First serie", reps: "First serie" };
        let updatedLastTrainingData = { weight: "First training", reps: "First training" };

        // LAST SERIE DATA

        // SEARCHING FOR LAST SERIE NUMBER
        if (state.seriesList.length !== 0) {

          state.seriesList.forEach((serie, index) => {
            if (serie.serieCount > currentlyAddingSerieNumber) {
              currentlyAddingSerieNumber = serie.serieCount;
              indexOfLastSerie = index;
            }
          });

          updatedLastSerieData = { 
            weight: state.seriesList[indexOfLastSerie].weight,
            reps: state.seriesList[indexOfLastSerie].reps 
          };
        }
      
        // LAST TRAINING DATA

        const potentialSeries = [];
        let previousTrainingSerie = {};
        let previousDateIds = props.dateIds;
      
        // FILTERING LOCAL STORAGE TO SEARCH A EXERCISE WITH CORRECT EXERCISEID AND NUMBER OF SERIE
        if (Object.keys(localStorage).length !== 0) {

          Object.keys(localStorage).forEach(key => {
            let value = JSON.parse(localStorage.getItem(key));

            if (value.exerciseId === props.exerciseId) {
              if (value.serieCount === currentlyAddingSerieNumber + 1) {
                if (
                  (value.dateIds.dayId < props.dateIds.dayId) && (value.dateIds.monthId < props.dateIds.monthId) && (value.dateIds.yearId === props.dateIds.yearId) ||
                  (value.dateIds.dayId < props.dateIds.dayId) && (value.dateIds.monthId === props.dateIds.monthId) && (value.dateIds.yearId === props.dateIds.yearId) ||
                  (value.dateIds.dayId >= props.dateIds.dayId) && (value.dateIds.monthId < props.dateIds.monthId) && (value.dateIds.yearId === props.dateIds.yearId) ||
                  (value.dateIds.dayId >= props.dateIds.dayId) && (value.dateIds.monthId >= props.dateIds.monthId) && (value.dateIds.yearId < props.dateIds.yearId)
                )
                  potentialSeries.push(value);
              }
            }
          });

          if (potentialSeries.length !== 0) {
            while (true) {
              previousDateIds = getPreviousTrainingDate(previousDateIds);
  
              potentialSeries.forEach(serie => {
                if (JSON.stringify(previousDateIds) === JSON.stringify(serie.dateIds))
                  previousTrainingSerie = serie;
              });
  
              if (previousTrainingSerie.weight !== undefined) {
                updatedLastTrainingData = { 
                  weight: previousTrainingSerie.weight,
                  reps: previousTrainingSerie.reps 
                };
                break;
              }
            }
          }
        }

        return {...state, 
          lastTimeData: {
            training: updatedLastTrainingData,
            serie: updatedLastSerieData
          }
        }
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

    dispatch({ type: ACTIONS.SORT_SERIESLIST });

  }, [props.dateIds]);


  // CLEARS SERIESLIST AFTER DAY CHANGE
  useEffect(() => { 
    return () => dispatch({ type: ACTIONS.CLEAR_SERIESLIST_BEFORE_DAY_CHANGING });

  }, [props.dateIds]);


  // 
  useEffect(() => { 

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


  // UPDATES LAST TIME DATA AFTER OPENING CHANGING WINDOWS
  useEffect(() => {
    if (state.isAddWindowOpened)
      dispatch({ type: ACTIONS.UPDATE_LASTTIME_DATA });
    countProgress();

  }, [state.isAddWindowOpened]);

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

  const countProgress = () => {
    const potentialTrainings = [];
    const lastTrainingData = [];
    let message = {};
    let percentValue = 0;
    let progressValue = 0;
    let previousDateIds = props.dateIds;
  
    // FILTERING LOCAL STORAGE TO SEARCH A EXERCISE WITH CORRECT EXERCISEID AND NUMBER OF SERIE
    if (Object.keys(localStorage).length !== 0) {

      Object.keys(localStorage).forEach(key => {
        let value = JSON.parse(localStorage.getItem(key));

        if (value.exerciseId === props.exerciseId) {
          if (
            (value.dateIds.dayId < props.dateIds.dayId) && (value.dateIds.monthId < props.dateIds.monthId) && (value.dateIds.yearId === props.dateIds.yearId) ||
            (value.dateIds.dayId < props.dateIds.dayId) && (value.dateIds.monthId === props.dateIds.monthId) && (value.dateIds.yearId === props.dateIds.yearId) ||
            (value.dateIds.dayId >= props.dateIds.dayId) && (value.dateIds.monthId < props.dateIds.monthId) && (value.dateIds.yearId === props.dateIds.yearId) ||
            (value.dateIds.dayId >= props.dateIds.dayId) && (value.dateIds.monthId >= props.dateIds.monthId) && (value.dateIds.yearId < props.dateIds.yearId)
          )
            potentialTrainings.push(value);
        }
      });

      if (potentialTrainings.length !== 0) {
        while (true) {
          previousDateIds = getPreviousTrainingDate(previousDateIds);

          potentialTrainings.forEach(training => {
            if (JSON.stringify(previousDateIds) === JSON.stringify(training.dateIds))
              lastTrainingData.push(training); 
          });

          if (lastTrainingData.length !== 0)
            break;
        }
      }
    }

    const lastTrainingTotal = countTotalWeight(lastTrainingData);
    const currentTrainingTotal = countTotalWeight(state.seriesList);
  
    progressValue = currentTrainingTotal - lastTrainingTotal;

    if (lastTrainingTotal)
      percentValue = ((progressValue / lastTrainingTotal) * 100).toFixed(2);
    else 
      percentValue = '';
      
    if (lastTrainingTotal > 0) {

      if (progressValue > 0) {
        message.top = `${progressValue.toFixed(2)} kg more`;
        message.bottom = `${percentValue}% more than last time`;
      }
      else if (progressValue === 0) {
        message.top = "The same result as last time";
        message.bottom = "";
      }

      else {
        progressValue *= -1;
        percentValue  *= -1;
        message.top = `${progressValue.toFixed(2)} kg less`;
        message.bottom = `${percentValue}% less than last time`;
      }
    }

    else {
      message.top = "First training, don't give up!";
      message.bottom = "";
    }
  
    return message;
  }

  const handleFormClearing = () => {
    dispatch({ type: ACTIONS.CHANGE_NEW_SERIE_DATA, payload: { key: 'weight', value: '' }});
    dispatch({ type: ACTIONS.CHANGE_NEW_SERIE_DATA, payload: { key: 'reps', value: '' }});
  }

  const handleOnChange = (e) => {
    // const newReg = /^[1-9]{1,}[.]{1}[0-9]{1,3}/
    const isNumber = /[0-9]/;
    const isZero = /^[0]{1}/;

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
    <div className="meal exercise" style={ (state.isExerciseOpened && window.innerWidth > 768) ? {left: '-10px'} : {left: '0px'} }>
      
      <section className="meal__top-section exercise__top-section" onClick={ handleExerciseOpening }>

        <h2 className="meal__top-section__meal-title">{ props.name }</h2>

        <div className="exercise__top-section__grade-container" title="Exercise difficulty">
          <span className="exercise__top-section__grade-container__point exercise__top-section__grade-container__point--filled"></span>
          <span className={ props.difficulty >= 2 ? "exercise__top-section__grade-container__point exercise__top-section__grade-container__point--filled" : "exercise__top-section__grade-container__point" }></span>
          <span className={ props.difficulty === 3 ? "exercise__top-section__grade-container__point exercise__top-section__grade-container__point--filled" : "exercise__top-section__grade-container__point" }></span>
        </div>

      </section>

      { state.seriesList.length !== 0 ? (
        <section className="meal__products-section exercise__series-section" style={ state.isExerciseOpened ? {display: "flex"} : {display: "none"} }>

          <ul className="exercise__series-section__list">
            { state.seriesList.map(serie => {
              return (
              <li key={ serie.id } className="exercise__series-section__list__item">
                  <p className="exercise__series-section__list__item__count">Serie { serie.serieCount }</p>
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
              <p className="exercise__series-section__list__item__count">
                <span>{ countProgress().top }</span>
                <span>{ countProgress().bottom }</span>
              </p>
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
            title={ props.name }
            description={ props.description }
            difficulty={ props.difficulty }
            typeOfExercise= { props.typeOfExercise}
            muscles={ props.muscles }
            properFormLink={ props.properFormLink }
            handleMoreWindow={ handleMoreWindow }
          />
        : null }

    </div>

  )
}