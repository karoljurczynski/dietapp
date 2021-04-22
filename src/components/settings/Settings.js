import { React, useReducer, useEffect } from 'react';
import { exercises } from '../../exercisesList';

const initialState = {
  isCategoryOpened: false,
  settingsData: {
    main: {

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

  // EFFECT WHICH CHECKS IS SETTINGS ARE SAVED IN LOCAL STORAGE
  useEffect(() => {

    if (Object.keys(localStorage).length !== 0)
      dispatch({ type: ACTIONS.LOAD_SETTINGS });   
    else
      saveSettingsToLocalStorage(); 

  }, []);

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
    console.log(e.target);

    if(props.category === "Account") {
      
    }
    
    if (props.category === "Nutrition") {
      if (e.target[4].checked === true)
        dispatch({ type: ACTIONS.SET_CLEAR_ALL_PRODUCTS, payload: true });

      if (e.target[5].checked === true)
        dispatch({ type: ACTIONS.RESET_NUTRITION_SETTINGS_TO_INITIAL });
    }

    if (props.category === "Training") {
      if (e.target[10].checked === true)
        dispatch({ type: ACTIONS.SET_CLEAR_ALL_SERIES, payload: true });

      if (e.target[11].checked === true)
        dispatch({ type: ACTIONS.RESET_TRAINING_SETTINGS_TO_INITIAL });
    }

    dispatch({ type: ACTIONS.SET_SETTINGS_CHANGED_STATE, payload: false });
    console.log(state.settingsData.training.selectedExercises);
    saveSettingsToLocalStorage();
    resetCheckbox("clearAllProducts");
    resetCheckbox("resetNutritionSettingsToInitial");
    resetCheckbox("clearAllSeries");
    resetCheckbox("resetTrainingSettingsToInitial");
    props.updateGauges();
  }

  const handleSettingsCanceled = (e) => {
    e.preventDefault();
    restoreSettingFromLocalStorage();
    resetCheckbox("clearAllProducts");
    resetCheckbox("resetNutritionSettingsToInitial");
    resetCheckbox("clearAllSeries");
    resetCheckbox("resetTrainingSettingsToInitial");
    props.updateGauges();
  }

  const handleExerciseChoosing = (e) => {
    if (e.target.checked)
      dispatch({ type: ACTIONS.ADD_EXERCISE_TO_SELECTEDEXERCISES, payload: Number(e.target.id[e.target.id.length - 1]) });
    else
      dispatch({ type: ACTIONS.REMOVE_EXERCISE_FROM_SELECTEDEXERCISES, payload: Number(e.target.id[e.target.id.length - 1]) });
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

  return (
    <>
    <div className="meal" style={ state.isCategoryOpened ? {marginLeft: '-10px'} : {marginLeft: '0px'} }>
      <section className="meal__top-section" onClick={ handleOpening }>
        
        <h2 className="meal__top-section__meal-title">{ props.category }</h2>        
        
      </section>

      <section className="meal__products-section" style={ state.isCategoryOpened ? {display: "flex"} : {display: "none"} }>
          
          { (props.category === "Nutrition" && state.clearAllProducts) && 
            <>
              <div>Remove ALL products?</div>
              <button onClick={ confirmClearAllProducts }>Remove</button>
              <button onClick={ cancelClearAllProducts }>Cancel</button>
            </>
          }

          { (props.category === "Training" && state.clearAllSeries) && 
            <>
              <div>Remove ALL series?</div>
              <button onClick={ confirmClearAllSeries }>Remove</button>
              <button onClick={ cancelClearAllSeries }>Cancel</button>
            </>
          }

          { props.category === "Account" &&
          <section className="center-section__main__settings">

            <form className="center-section__main__settings__form" onSubmit={ handleSettingsSaved }>

              <section className="center-section__main__settings__form__section">

                <h2 className="center-section__main__settings__form__section__title">Account</h2>

              </section>

              <section className="meal__buttons-section" style={ state.isCategoryOpened ? {display: "flex"} : {display: "none"} }>
                
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

            <form className="center-section__main__settings__form" onSubmit={ handleSettingsSaved }>

              <section className="center-section__main__settings__form__section">

                <h2 className="center-section__main__settings__form__section__title">Nutrition</h2>

                <label htmlFor="setDailyDemand">Set daily demand: </label>

                <section id="setDailyDemand" className="center-section__main__settings__form__section__daily-demand">
                  <span className="center-section__main__settings__form__section__input">
                    <label htmlFor="kcal">Kcal: </label>
                    <input 
                      type="text" 
                      id="kcal"
                      value={ state.settingsData.nutrition.dailyDemand.kcal }
                      maxLength={5}
                      onChange={ handleSettingOnChange }
                      required />
                  </span>
                  
                  <span className="center-section__main__settings__form__section__input">
                    <label htmlFor="proteins">Proteins: </label>
                    <input 
                      type="text" 
                      id="proteins"
                      value={ state.settingsData.nutrition.dailyDemand.proteins }
                      maxLength={4}
                      onChange={ handleSettingOnChange }
                      required />
                  </span>

                  <span className="center-section__main__settings__form__section__input">
                    <label htmlFor="fats">Fats: </label>
                    <input 
                      type="text" 
                      id="fats"
                      value={ state.settingsData.nutrition.dailyDemand.fats }
                      maxLength={4}
                      onChange={ handleSettingOnChange }
                      required />
                  </span>

                  <span className="center-section__main__settings__form__section__input">
                    <label htmlFor="carbs">Carbs: </label>
                    <input 
                      type="text" 
                      id="carbs"
                      value={ state.settingsData.nutrition.dailyDemand.carbs }
                      maxLength={4}
                      onChange={ handleSettingOnChange } 
                      required />
                  </span>

                </section>

                <span className="center-section__main__settings__form__section__input">
                  <label htmlFor="clearAllProducts">Clear all products: </label>
                  <input 
                    type="checkbox" 
                    id="clearAllProducts" />
                </span>

                <span className="center-section__main__settings__form__section__input">
                  <label htmlFor="resetNutritionSettingsToInitial">Reset nutrition settings to initial: </label>
                  <input 
                    type="checkbox" 
                    id="resetNutritionSettingsToInitial" />
                </span>

                <span className="center-section__main__settings__form__section__input">
                  <label htmlFor="setMealsNumber">Set number of meals: </label>
                  <input 
                    type="text" 
                    id="setMealsNumber"
                    maxLength="1"
                    value={ state.settingsData.nutrition.numberOfMeals }
                    onChange={ handleSettingOnChange }
                    required />
                </span>

                
                { Object.values(state.settingsData.nutrition.namesOfMeals).map((meal, index) => {
                  if (state.settingsData.nutrition.numberOfMeals > index) {
                    return (
                      <span key={ index } className="center-section__main__settings__form__section__input">
                        <label htmlFor="editMealName">Set meal name: </label>
                        <input
                          data-key={ index }
                          type="text" 
                          id="editMealName"
                          value={ state.settingsData.nutrition.namesOfMeals[index] } 
                          onChange={ handleSettingOnChange }
                          required />
                      </span>
                    ) 
                  }

                  else {
                    return (
                      null
                    )
                  }
                })}
                
              </section>

              <section className="meal__buttons-section" style={ state.isCategoryOpened ? {display: "flex"} : {display: "none"} }>
                
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

          { props.category === "Training" &&
            <section className="center-section__main__settings">

            <form className="center-section__main__settings__form" onSubmit={ handleSettingsSaved }>

              <section className="center-section__main__settings__form__section">

                <h2 className="center-section__main__settings__form__section__title">Training</h2>

                <label htmlFor="chooseExercises">Choose exercises: </label>

                <section id="chooseExercises" className="center-section__main__settings__form__section__daily-demand">
                  { exercises.map(exercise => {
                    return (
                      <span key={ exercise.id } className="center-section__main__settings__form__section__input">
                        <label htmlFor={"exercise"+ exercise.id }>{ exercise.name }: </label>
                        <input 
                          type="checkbox"
                          checked={ state.settingsData.training.selectedExercises.includes(exercise.id) ? true : false } 
                          id={"exercise"+ exercise.id }
                          onChange={ handleExerciseChoosing }
                          />
                      </span>
                    )}) 
                  }
                  
                </section>

                <span className="center-section__main__settings__form__section__input">
                  <label htmlFor="clearAllSeries">Clear all series: </label>
                  <input 
                    type="checkbox" 
                    id="clearAllSeries" />
                </span>

                <span className="center-section__main__settings__form__section__input">
                  <label htmlFor="resetTrainingSettingsToInitial">Reset training settings to initial: </label>
                  <input 
                    type="checkbox" 
                    id="resetTrainingSettingsToInitial" />
                </span>

              </section>

              <section className="meal__buttons-section" style={ state.isCategoryOpened ? {display: "flex"} : {display: "none"} }>
                
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

      </section>
      
    </div>

    </>
  )
}