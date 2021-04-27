import { React, useReducer, useEffect, useState } from 'react';
import { exercises } from '../../exercisesList';
import '../../components/product_removing_window/styles/productRemovingWindow.css';
import '../../components/product_adding_window/styles/productAddingWindow.css';


const initialState = {
  isCategoryOpened: false,
  settingsData: {
    account: {

    },

    nutrition: {
      dailyDemand: { kcal: 2000, proteins: 120, fats: 55, carbs: 240 },
      namesOfMeals: { 0: "Breakfast", 1: "II Breakfast", 2: "Lunch", 3: "Snack", 4: "Dinner", 5: "", 6: "", 7: "", 8: "", 9: "" },
      numberOfMeals: 5
    },

    training: {
      selectedExercises: [0, 1, 2, 3, 5]
    }
  },
  clearAllProducts: false,
  clearAllSeries: false,
  isSettingsChanged: false
};

const ACTIONS = {
  NEGATE_CATEGORY_OPENED: 'negate-category-opened',
  CHANGE_SETTINGS_DATA: 'change-settings-data',
  LOAD_SETTINGS: 'load-settings',
  SET_CLEAR_ALL_PRODUCTS: 'set-clear-all-products',
  SET_CLEAR_ALL_SERIES: 'set-clear-all-series',
  ADD_EXERCISE_TO_SELECTEDEXERCISES: 'add-exercise-to-selectedexercises',
  REMOVE_EXERCISE_FROM_SELECTEDEXERCISES: 'remove-exercise-from-selectedexercises',
  SET_SETTINGS_CHANGED_STATE: 'set-settings-changed-state',
  RESET_NUTRITION_SETTINGS_TO_INITIAL: 'reset-nutrition-settings-to-initial',
  RESET_TRAINING_SETTINGS_TO_INITIAL: 'reset-training-settings-to-initial'
}

export default function Settings(props) {
  const reducer = (state, action) => {
    switch (action.type) {

      case ACTIONS.NEGATE_CATEGORY_OPENED: {
        return { ...state, isCategoryOpened: !state.isCategoryOpened }
      }

      case ACTIONS.CHANGE_SETTINGS_DATA: {
        switch (action.payload.key) {

          case 'editMealName': {
            return {...state, 
              settingsData: { ...state.settingsData, 
              nutrition: {...state.settingsData.nutrition,
              namesOfMeals: {...state.settingsData.nutrition.namesOfMeals, [action.payload.index]: action.payload.value }}}
            };
          };

          case 'setMealsNumber': {
            return {...state, 
              settingsData: { ...state.settingsData, 
              nutrition: {...state.settingsData.nutrition,
              numberOfMeals: action.payload.value }}
            };
          };

          default: return {...state, 
                           settingsData: { ...state.settingsData, 
                           nutrition: {...state.settingsData.nutrition, 
                           dailyDemand: {...state.settingsData.nutrition.dailyDemand, 
                           [action.payload.key]: action.payload.value }}}};
        }
      }

      case ACTIONS.LOAD_SETTINGS: {
        let newSettings = JSON.parse(localStorage.getItem("settings"));
        return {...state, settingsData: newSettings }
      }

      case ACTIONS.SET_CLEAR_ALL_PRODUCTS: {
        return { ...state, clearAllProducts: action.payload };
      }

      case ACTIONS.SET_CLEAR_ALL_SERIES: {
        return { ...state, clearAllSeries: action.payload };
      }

      case ACTIONS.ADD_EXERCISE_TO_SELECTEDEXERCISES: {
        const updatedSelectedExercises = state.settingsData.training.selectedExercises;
        updatedSelectedExercises.push(action.payload);

        return {...state, 
          settingsData: { ...state.settingsData, 
          training: {...state.settingsData.training,
          selectedExercises: updatedSelectedExercises }}
        };
      }

      case ACTIONS.REMOVE_EXERCISE_FROM_SELECTEDEXERCISES: {
        const updatedSelectedExercises = state.settingsData.training.selectedExercises;
        const indexOfExerciseToRemoving = updatedSelectedExercises.indexOf(action.payload);
        updatedSelectedExercises.splice(indexOfExerciseToRemoving, 1);

        return {...state, 
          settingsData: { ...state.settingsData, 
          training: {...state.settingsData.training,
          selectedExercises: updatedSelectedExercises }}
        }
      }

      case ACTIONS.SET_SETTINGS_CHANGED_STATE: {
        return { ...state, isSettingsChanged: action.payload };
      }

      case ACTIONS.RESET_NUTRITION_SETTINGS_TO_INITIAL: {
        return { ...state, settingsData: { ...state.settingsData, nutrition: props.initialData }};
      }

      case ACTIONS.RESET_TRAINING_SETTINGS_TO_INITIAL: {
        console.log(state.settingsData.training.selectedExercises);
        return { ...state, settingsData: { ...state.settingsData, training: props.initialData }};
      }

      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialOptionsStates = {
    'clear-all-products': false,
    'reset-nutrition-to-initial': false,
    'clear-all-series': false,
    'reset-training-to-initial': false
  };

  const [optionsStates, setOptionsStates] = useState(initialOptionsStates);

  // EFFECT WHICH CHECKS IS SETTINGS ARE SAVED IN LOCAL STORAGE
  useEffect(() => {
    if (Object.keys(localStorage).length !== 0)
      dispatch({ type: ACTIONS.LOAD_SETTINGS });   
    else
      saveSettingsToLocalStorage(); 

  }, []);

  // EFFECT WHICH ENABLE POINTER EVENTS AFTER OPENING CONFIRM WINDOW
  useEffect(() => {
    if (state.clearAllProducts || state.clearAllSeries) {
      const confirmWindow = document.querySelector(".removing-window__confirm");
      confirmWindow.style.pointerEvents = "auto";
    }

  }, [ state.clearAllProducts, state.clearAllSeries ]);

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

    (state.clearAllProducts || state.clearAllSeries)
    ? changePointerEvents("none")
    : changePointerEvents("auto");
    
  }, [ state.clearAllProducts, state.clearAllSeries ]);

  // EFFECT WHICH CHECKS IS SETTINGS ARE CHANGED
  useEffect(() => {
    const localStorageSettings = localStorage.getItem("settings");
    const currentSettings = JSON.stringify(state.settingsData);
    console.log(localStorageSettings);
    console.log(state.settingsData);

    if (localStorageSettings === currentSettings)
      dispatch({ type: ACTIONS.SET_SETTINGS_CHANGED_STATE, payload: false });
    else
      dispatch({ type: ACTIONS.SET_SETTINGS_CHANGED_STATE, payload: true});

  }, [ state.settingsData ]);


  const handleOpening = () => {
    dispatch({ type: ACTIONS.NEGATE_CATEGORY_OPENED });
  }

  const resetCheckbox = (idOfCheckbox) => {
    document.querySelector("#" + idOfCheckbox).checked = false;
  }

  const resetOptionsStates = () => {
    Object.keys(optionsStates).forEach(key => {
      optionsStates[key] = false;
    });
  }

  const saveSettingsToLocalStorage = () => {
    localStorage.setItem("settings", JSON.stringify(state.settingsData));
  }

  const restoreSettingFromLocalStorage = () => {
    dispatch({ type: ACTIONS.LOAD_SETTINGS });
  }

  const confirmClearAllProducts = () => {
    dispatch({ type: ACTIONS.SET_CLEAR_ALL_PRODUCTS, payload: false });

    Object.keys(localStorage).forEach(key => {
      let value = JSON.parse(localStorage.getItem(key));
      if (value.mealId >= 0)
        localStorage.removeItem(key);
    });
  }

  const cancelClearAllProducts = () => {
    dispatch({ type: ACTIONS.SET_CLEAR_ALL_PRODUCTS, payload: false });
  }

  const confirmClearAllSeries = () => {
    dispatch({ type: ACTIONS.SET_CLEAR_ALL_SERIES, payload: false });

    Object.keys(localStorage).forEach(key => {
      let value = JSON.parse(localStorage.getItem(key));
      if (value.exerciseId >= 0)
        localStorage.removeItem(key);
    });

  }

  const cancelClearAllSeries = () => {
    dispatch({ type: ACTIONS.SET_CLEAR_ALL_SERIES, payload: false });
  }

  const handleSettingsSaved = (e) => {
    e.preventDefault();

    if (optionsStates['clear-all-products'])
      dispatch({ type: ACTIONS.SET_CLEAR_ALL_PRODUCTS, payload: true });
    if (optionsStates['reset-nutrition-to-initial'])
      dispatch({ type: ACTIONS.RESET_NUTRITION_SETTINGS_TO_INITIAL });
    if (optionsStates['clear-all-series'])
      dispatch({ type: ACTIONS.SET_CLEAR_ALL_SERIES, payload: true });
    if (optionsStates['reset-training-to-initial'])
      dispatch({ type: ACTIONS.RESET_TRAINING_SETTINGS_TO_INITIAL });

    dispatch({ type: ACTIONS.SET_SETTINGS_CHANGED_STATE, payload: false });
    saveSettingsToLocalStorage();
    resetOptionsStates();
    props.updateGauges();
  }

  const handleSettingsCanceled = (e) => {
    e.preventDefault();
    restoreSettingFromLocalStorage();
    resetOptionsStates();
    props.updateGauges();
  }

  const handleExerciseChoosing = (e) => {
    if (e.target.style.backgroundColor) {
      if (e.target.style.backgroundColor === "transparent")
        dispatch({ type: ACTIONS.ADD_EXERCISE_TO_SELECTEDEXERCISES, payload: Number(e.target.id[e.target.id.length - 1]) });
      else
        dispatch({ type: ACTIONS.REMOVE_EXERCISE_FROM_SELECTEDEXERCISES, payload: Number(e.target.id[e.target.id.length - 1]) });
    }

    else {
      if (e.target.children[0].style.backgroundColor === "transparent")
        dispatch({ type: ACTIONS.ADD_EXERCISE_TO_SELECTEDEXERCISES, payload: Number(e.target.id[e.target.id.length - 1]) });
      else
        dispatch({ type: ACTIONS.REMOVE_EXERCISE_FROM_SELECTEDEXERCISES, payload: Number(e.target.id[e.target.id.length - 1]) });
    }
  }

  const handleSettingOnChange = (e) => {
    const isNumber = /[0-9]/;
    const isZero = /^[0]{1}/;

    e.preventDefault();
  
    if (e.target.id === 'editMealName') {
      dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, index: Number(e.target.attributes["data-key"].value), value: e.target.value }})
    }
    
    if (isNumber.test(e.target.value[e.target.value.length - 1])) {

      if (isZero.test(e.target.value))
        dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, value: 1 }});
      else
        dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, value: e.target.value }});
    }

    else
      dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, value: "" }});

    props.updateGauges();
  }

  const handleCheckboxOnClick = (e) => {
    setOptionsStates(prevOptions => { return {...prevOptions, [e.target.id]: !optionsStates[e.target.id]} });
  }

  return (
    <>
    <div className="meal" style={ state.isCategoryOpened ? {marginLeft: '-10px'} : {marginLeft: '0px'} }>
      <section className="meal__top-section" onClick={ handleOpening }>
        
        <h2 className="meal__top-section__meal-title">{ props.category }</h2>        
        
      </section>

      <section className="meal__products-section meal__products-section--settings" style={ state.isCategoryOpened ? {display: "flex"} : {display: "none"} }>
          
        { props.category === "Account" &&
          <section className="center-section__main__settings">

          <form className="center-section__main__settings__form" onSubmit={ handleSettingsSaved }>

            <section className="center-section__main__settings__form__section">
            
            </section>

            <section className="meal__buttons-section meal__buttons-section--settings" style={ state.isCategoryOpened ? {display: "flex"} : {display: "none"} }>
              
              <div>
              <button 
                className="meal__buttons-section__remove-button"
                onClick={ handleSettingsCanceled }
                type="button" 
                disabled={ state.isSettingsChanged ? false : true }>
                Cancel</button> 

              <button 
                className="meal__buttons-section__add-button"
                type="submit" 
                value="Save" 
                id="saveSettings">
                Save</button>  
              </div>     
            
            </section>

          </form>

        </section>
        }

        { props.category === "Nutrition" &&
          <section className="center-section__main__settings">

          { state.clearAllProducts &&
            <section className="removing-window__confirm">

                <h1 className="removing-window__title">Clear all?</h1> 

                <h3 className="removing-window__confirm__subtitle">Are you sure you want to clear all products?</h3>

                <section className="removing-window__main__list__buttons-section" style={{ justifyContent: "flex-end" }}>
                  <div>
                    <button className="removing-window__main__list__buttons-section__secondary" onClick={ cancelClearAllProducts }>Cancel</button>
                    <button className="removing-window__main__list__buttons-section__primary" onClick={ confirmClearAllProducts }>Remove</button>
                  </div>
                </section>

            </section>
          }

          <form className="adding-window__main__form" onSubmit={ handleSettingsSaved }>

            <section className="adding-window__main__form adding-window__main__form--daily-demand">
      
              <h3 className="adding-window__main__form__title">Daily demand</h3>

              <div className="adding-window__main__form__line adding-window__main__form__line--short">
                <label className="adding-window__main__form__line__label" htmlFor="proteins">Proteins</label>
                <input 
                  className="adding-window__main__form__line__input" 
                  type="text" 
                  id="proteins"
                  value={ state.settingsData.nutrition.dailyDemand.proteins }
                  onChange={ handleSettingOnChange }
                  placeholder="Proteins"
                  maxLength="4">
                </input>
                <span className="adding-window__main__form__line__decoration">g</span>
                {/*<p className="adding-window__main__form__line__warning">{ props.warning[1] === 'weight' ? props.warning[0] : null }</p>*/}
              </div>

              <div className="adding-window__main__form__line adding-window__main__form__line--short">
                <label className="adding-window__main__form__line__label" htmlFor="fats">Fats</label>
                <input 
                  className="adding-window__main__form__line__input" 
                  type="text" 
                  id="fats"
                  value={ state.settingsData.nutrition.dailyDemand.fats }
                  onChange={ handleSettingOnChange }
                  placeholder="Fats"
                  maxLength="4">
                </input>
                <span className="adding-window__main__form__line__decoration">g</span>
                {/*<p className="adding-window__main__form__line__warning">{ props.warning[1] === 'weight' ? props.warning[0] : null }</p>*/}
              </div>

              <div className="adding-window__main__form__line adding-window__main__form__line--short">
                <label className="adding-window__main__form__line__label" htmlFor="Carbs">Carbs</label>
                <input 
                  className="adding-window__main__form__line__input" 
                  type="text" 
                  id="Carbs"
                  value={ state.settingsData.nutrition.dailyDemand.carbs }
                  onChange={ handleSettingOnChange }
                  placeholder="Carbs"
                  maxLength="4">
                </input>
                <span className="adding-window__main__form__line__decoration">g</span>
                {/*<p className="adding-window__main__form__line__warning">{ props.warning[1] === 'weight' ? props.warning[0] : null }</p>*/}
              </div>

              <div className="adding-window__main__form__line adding-window__main__form__line--short">
                <label className="adding-window__main__form__line__label" htmlFor="kcal">Calories</label>
                <input 
                  className="adding-window__main__form__line__input" 
                  type="text" 
                  id="kcal"
                  value={ state.settingsData.nutrition.dailyDemand.kcal }
                  onChange={ handleSettingOnChange }
                  placeholder="Calories"
                  maxLength="4">
                </input>
                <span className="adding-window__main__form__line__decoration">kcal</span>
                {/*<p className="adding-window__main__form__line__warning">{ props.warning[1] === 'weight' ? props.warning[0] : null }</p>*/}
              </div>
            
            </section>

            <section className="adding-window__main__form adding-window__main__form--meals">
      
              <h3 className="adding-window__main__form__title">Meals</h3>

              <div className="adding-window__main__form__line adding-window__main__form__line--short">
                <label className="adding-window__main__form__line__label" htmlFor="setMealsNumber">Number of meals</label>
                <input 
                  className="adding-window__main__form__line__input" 
                  type="text" 
                  id="setMealsNumber"
                  value={ state.settingsData.nutrition.numberOfMeals }
                  onChange={ handleSettingOnChange }
                  maxLength="1">
                </input>
                <span className="adding-window__main__form__line__decoration">meals</span>
                {/*<p className="adding-window__main__form__line__warning">{ props.warning[1] === 'weight' ? props.warning[0] : null }</p>*/}
              </div>

              { Object.values(state.settingsData.nutrition.namesOfMeals).map((meal, index) => {
                if (state.settingsData.nutrition.numberOfMeals > index) {
                  return (
                    <div key={ index } className="adding-window__main__form__line adding-window__main__form__line--normal">
                      <label className="adding-window__main__form__line__label" htmlFor="editMealName">{`Set meal nr ${ index + 1 } name: `}</label>
                      <input 
                        className="adding-window__main__form__line__input"
                        data-key={ index } 
                        type="text" 
                        id="editMealName"
                        value={ state.settingsData.nutrition.namesOfMeals[index] } 
                        onChange={ handleSettingOnChange }
                        required>
                      </input>
                      {/*<p className="adding-window__main__form__line__warning">{ props.warning[1] === 'weight' ? props.warning[0] : null }</p>*/}
                    </div>
                  ) 
                }

                else {
                  return (
                    null
                  )
                }
              })}
              
            </section>

            <section className="adding-window__main__form adding-window__main__form--options">

              <h3 className="adding-window__main__form__title">Options</h3>

              <div className="adding-window__main__form__line adding-window__main__form__line--checkbox">
                <label className="adding-window__main__form__line__label adding-window__main__form__line__label--options" htmlFor="clearAllProducts">Clear all products</label>
                <button 
                  className="adding-window__main__form__background"
                  id="clear-all-products"
                  type="button"
                  onClick={ handleCheckboxOnClick }>
                  <div 
                    className="adding-window__main__form__background__checked" 
                    id="clear-all-products"
                    style={ optionsStates["clear-all-products"] ? {backgroundColor: "#7500AF"} : {backgroundColor: "transparent"} }>
                  </div>
                </button>
              </div>

              <div className="adding-window__main__form__line adding-window__main__form__line--checkbox">
                <label className="adding-window__main__form__line__label adding-window__main__form__line__label--options" htmlFor="resetNutritionSettingsToInitial">Reset nutrition settings to initial</label>
                <button 
                  className="adding-window__main__form__background"
                  id="reset-nutrition-to-initial"
                  type="button"
                  onClick={ handleCheckboxOnClick }>
                  <div 
                    className="adding-window__main__form__background__checked" 
                    id="reset-nutrition-to-initial"
                    style={ optionsStates["reset-nutrition-to-initial"] ? {backgroundColor: "#7500AF"} : {backgroundColor: "transparent"} }>
                  </div>
                </button>
              </div>

            </section>

            <section className="meal__buttons-section meal__buttons-section--settings" style={ state.isCategoryOpened ? {display: "flex"} : {display: "none"} }>
              
              <div>
              <button 
                className={ state.isSettingsChanged ? "meal__buttons-section__remove-button" : "meal__buttons-section__remove-button meal__buttons-section__remove-button--disabled" }
                onClick={ handleSettingsCanceled }
                type="button" 
                disabled={ state.isSettingsChanged ? false : true }>
                Cancel</button> 

              <button 
                className="meal__buttons-section__add-button"
                type="submit" 
                value="Save" 
                id="saveSettings">
                Save</button>  
              </div>     
            
            </section>

          </form>

        </section>
        }

        { props.category === "Training" &&
          <section className="center-section__main__settings">

          { state.clearAllSeries &&
          <section className="removing-window__confirm">

            <h1 className="removing-window__title">Clear all?</h1> 

            <h3 className="removing-window__confirm__subtitle">Are you sure you want to clear all series?</h3>

            <section className="removing-window__main__list__buttons-section" style={{ justifyContent: "flex-end" }}>
              <div>
                <button className="removing-window__main__list__buttons-section__secondary" onClick={ cancelClearAllSeries }>Cancel</button>
                <button className="removing-window__main__list__buttons-section__primary" onClick={ confirmClearAllSeries }>Remove</button>
              </div>
            </section>

          </section>
          } 

          <form className="center-section__main__settings__form" onSubmit={ handleSettingsSaved }>


            <section className="adding-window__main__form adding-window__main__form--exercises">
              <h3 className="adding-window__main__form__title">Choose exercises</h3>
                { exercises.map(exercise => {
                  return (
                    <div key={ exercise.id } className="adding-window__main__form__line adding-window__main__form__line--checkbox">
                      <label className="adding-window__main__form__line__label adding-window__main__form__line__label--options" htmlFor={"exercise"+ exercise.id }>{ exercise.name }:</label>
                      <button 
                        className="adding-window__main__form__background"
                        id={"exercise"+ exercise.id }
                        type="button"
                        onClick={ handleExerciseChoosing }>
                        <div 
                          className="adding-window__main__form__background__checked" 
                          id={"exercise"+ exercise.id }
                          style={ state.settingsData.training.selectedExercises.includes(exercise.id) ? {backgroundColor: "#7500AF"} : {backgroundColor: "transparent"} }>
                        </div>
                      </button>
                    </div>
                  )}) 
                }
                
              </section>

            <section className="adding-window__main__form adding-window__main__form--options">

              <h3 className="adding-window__main__form__title">Options</h3>

              <div className="adding-window__main__form__line adding-window__main__form__line--checkbox">
                <label className="adding-window__main__form__line__label adding-window__main__form__line__label--options" htmlFor="clear-all-series">Clear all series</label>
                <button 
                  className="adding-window__main__form__background"
                  id="clear-all-series"
                  type="button"
                  onClick={ handleCheckboxOnClick }>
                  <div 
                    className="adding-window__main__form__background__checked" 
                    id="clear-all-series"
                    style={ optionsStates["clear-all-series"] ? {backgroundColor: "#7500AF"} : {backgroundColor: "transparent"} }>
                  </div>
                </button>
              </div>

              <div className="adding-window__main__form__line adding-window__main__form__line--checkbox">
                <label className="adding-window__main__form__line__label adding-window__main__form__line__label--options" htmlFor="reset-training-to-initial">Reset training settings to initial</label>
                <button 
                  className="adding-window__main__form__background"
                  id="reset-training-to-initial"
                  type="button"
                  onClick={ handleCheckboxOnClick }>
                  <div 
                    className="adding-window__main__form__background__checked" 
                    id="reset-training-to-initial"
                    style={ optionsStates["reset-training-to-initial"] ? {backgroundColor: "#7500AF"} : {backgroundColor: "transparent"} }>
                  </div>
                </button>
              </div>

            </section>

            <section className="meal__buttons-section meal__buttons-section--settings" style={ state.isCategoryOpened ? {display: "flex"} : {display: "none"} }>
              
              <div>
              <button 
                className={ state.isSettingsChanged ? "meal__buttons-section__remove-button" : "meal__buttons-section__remove-button meal__buttons-section__remove-button--disabled" }
                onClick={ handleSettingsCanceled }
                type="button" 
                disabled={ state.isSettingsChanged ? false : true }>
                Cancel</button> 

              <button 
                className="meal__buttons-section__add-button"
                type="submit" 
                value="Save" 
                id="saveSettings">
                Save</button>  
              </div>     
            
            </section>

          </form>

        </section>
        }

      </section>
      
    </div>

    </>
  )
}