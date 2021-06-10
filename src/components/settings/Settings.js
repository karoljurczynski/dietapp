// IMPORTS

import { React, useReducer, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaChevronCircleLeft, FaSave } from 'react-icons/fa';
import { exercises } from '../../exercisesList';

import { db } from '../../index'; 
import { collection, getDocs, setDoc, doc } from "firebase/firestore";


// VARIABLES

const initialState = {
  isCategoryOpened: false,
  isAccountCategory: false,
  isNutritionCategory: true,
  isTrainingCategory: false,
  warnings: {
    username: "",
    email: "",
    password: "",
    editMealName: "",
    setMealsNumber: "",
    proteins: "",
    fats: "",
    carbs: "",
    kcal: ""
  },
  settingsData: {
    account: {
      username: "",
      email: "",
      password: ""
    },

    nutrition: {
      dailyDemand: { kcal: 2000, proteins: 120, fats: 55, carbs: 240 },
      namesOfMeals: { 0: "Breakfast", 1: "II Breakfast", 2: "Lunch", 3: "Snack", 4: "Dinner", 5: "", 6: "", 7: "", 8: "", 9: "" },
      numberOfMeals: 5
    },

    training: {
      selectedExercises: [0, 1, 2, 3, 4]
    }
  },
  clearAllProducts: false,
  clearAllSeries: false,
  isSettingsChanged: false
}

const initialOptionsStates = {
  'clear-all-products': false,
  'reset-nutrition-to-initial': false,
  'clear-all-series': false,
  'reset-training-to-initial': false
}

const ACTIONS = {
  NEGATE_CATEGORY_OPENED: 'negate-category-opened',
  CHANGE_SETTINGS_DATA: 'change-settings-data',
  LOAD_SETTINGS: 'load-settings',
  SET_WARNING: 'set-warning',
  CLEAR_WARNING: 'clear-warning',
  SET_CLEAR_ALL_PRODUCTS: 'set-clear-all-products',
  SET_CLEAR_ALL_SERIES: 'set-clear-all-series',
  ADD_EXERCISE_TO_SELECTEDEXERCISES: 'add-exercise-to-selectedexercises',
  REMOVE_EXERCISE_FROM_SELECTEDEXERCISES: 'remove-exercise-from-selectedexercises',
  SET_SETTINGS_CHANGED_STATE: 'set-settings-changed-state',
  RESET_NUTRITION_SETTINGS_TO_INITIAL: 'reset-nutrition-settings-to-initial',
  RESET_TRAINING_SETTINGS_TO_INITIAL: 'reset-training-settings-to-initial',
  SET_CATEGORY: 'set-category',
  SET_NEW_SETTINGS: 'set-new-settings'
}

const warnings = {
  editMealName:   "Meal name must be a string of letters only",
  setMealsNumber: "Number of meals must be a positive number",
  macros: "Macronutrient must be a positive number",
  emailFail: "Incorrect e-mail!",
  minLengthFail: "Field is too short!",
  maxLengthFail: "Field is too long!",
  emptyFail: "Field is empty!",
  isZero: "Number must be higher than zero!"
}


// COMPONENT

export default function Settings(props) {

  // HOOKS

  const [optionsStates, setOptionsStates] = useState(initialOptionsStates);
  const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.NEGATE_CATEGORY_OPENED: {
        return { ...state, isCategoryOpened: !state.isCategoryOpened }
      }

      case ACTIONS.CHANGE_SETTINGS_DATA: {
        switch (action.payload.key) {
          case 'username': {
            return {...state, 
              settingsData: { ...state.settingsData, 
              account: {...state.settingsData.account,
              username: action.payload.value }}
            };
          }

          case 'email': {
            return {...state, 
              settingsData: { ...state.settingsData, 
              account: {...state.settingsData.account,
              email: action.payload.value }}
            };
          }

          case 'password': {
            return {...state, 
              settingsData: { ...state.settingsData, 
              account: {...state.settingsData.account,
              password: action.payload.value }}
            };
          }

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

      case ACTIONS.SET_NEW_SETTINGS: {
        return { ...state, settingsData: action.payload }
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
        return { ...state, settingsData: { ...state.settingsData, nutrition: initialState.settingsData.nutrition }};
      }

      case ACTIONS.RESET_TRAINING_SETTINGS_TO_INITIAL: {
        return { ...state, settingsData: { ...state.settingsData, training: initialState.settingsData.training }};
      }

      case ACTIONS.SET_CATEGORY: {
        let category = action.payload.category;
        return { ...state, [category]: action.payload.value };
      }

      case ACTIONS.SET_WARNING: {
        return { ...state, warnings: { ...state.warnings, [action.payload.field]: action.payload.warning }}
      }

      case ACTIONS.CLEAR_WARNING: {
        return { ...state, warning: ['', action.payload]};
      }

      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);


  // EFFECTS

  // SEARCH FOR SETTINGS IN LOCALSTORAGE
  const saveSettingsToDatabase = async () => {
    try {
      await setDoc(doc(db, "users", String(props.userId)), {
        settings: state.settingsData
      }, 
      { merge: true });
    }
    catch (e) {
      console.error(e);
    }

    updateUserPersonalData(state.settingsData.account.username, state.settingsData.account.email, state.settingsData.account.password);
  }

  const clearDatabase = async (data) => {
    try {
      await setDoc(doc(db, "users", String(props.userId)), {
        [data]: []
      }, 
      { merge: true });
    }
    catch (e) {
      console.error(e);
    }
  }

  const getSettingsFromDatabase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach(user => {
        if (user.id === props.userId) {
          if (user.data().settings) {
            dispatch({ type: ACTIONS.SET_NEW_SETTINGS, payload: user.data().settings });
            localStorage.setItem("settingsBackup", JSON.stringify(user.data().settings));
          }
            
          else
            saveSettingsToDatabase();
        }
      });
    }

    catch (e) {
      console.error(e);
    }
  }

  const updateUserPersonalData = async (newUsername, newEmail, newPassword) => {
    try {
      await setDoc(doc(db, "users", String(props.userId)), {
        username: newUsername,
        email: newEmail,
        password: newPassword
      }, 
      { merge: true });
    }
    catch (e) {
      console.error(e);
    }
  }

  // LOADS SETTINGS FROM DATABASE
  useEffect(() => {
    getSettingsFromDatabase();

  }, []);
  
  // BLURING AND DISABLING POINTER EVENTS ON BACKGROUND AFTER MOUNTING
  useEffect(() => {
    const wrapper = document.querySelector(".wrapper");
    const rootElement = document.querySelector("#root");
    const hamburger = document.querySelector(".left-section__hamburger");
    wrapper.style.filter = "blur(5px) opacity(40%) grayscale(100%)";
    wrapper.style.pointerEvents = "none";
    rootElement.style.zIndex = 97;
    hamburger.style.display = "none";
    
    return (() => {
      wrapper.style.filter = "blur(0px) opacity(100%) grayscale(0%)";
      wrapper.style.pointerEvents = "auto";
      rootElement.style.zIndex = 99;
      if (window.innerWidth < 769)
        hamburger.style.display = "block";
    })

  }, []);

  // BLURING AND DISABLING POINTER EVENTS ON WINDOW AFTER CONFIRM WINDOW MOUNTING
  useEffect(() => {
    const settingsWindow = document.querySelector(".window");
    if (state.clearAllProducts || state.clearAllSeries) {
      settingsWindow.style.filter = "blur(5px) opacity(40%) grayscale(100%)";
      settingsWindow.style.pointerEvents = "none";
    }
    else {
      settingsWindow.style.filter = "blur(0px) opacity(100%) grayscale(0%)";
      settingsWindow.style.pointerEvents = "auto";
    }

  }, [ state.clearAllProducts, state.clearAllSeries ]);

  // CHECKS IF SETTINGS WERE CHANGED
  useEffect(() => {
    const backupSettings = localStorage.getItem("settingsBackup");
    const currentSettings = JSON.stringify(state.settingsData);

    if (backupSettings === currentSettings)
      dispatch({ type: ACTIONS.SET_SETTINGS_CHANGED_STATE, payload: false });
    else
      dispatch({ type: ACTIONS.SET_SETTINGS_CHANGED_STATE, payload: true });

    return () => dispatch({ type: ACTIONS.SET_SETTINGS_CHANGED_STATE, payload: false });

  }, [ state.settingsData ]);

  // CHECKS IF OPTIONS CHECKBOXES WERE CHANGED
  useEffect(() => {
    for (let i = 0; i < Object.keys(optionsStates).length; i++) {
      if (Object.values(optionsStates)[i] === true) {
        dispatch({ type: ACTIONS.SET_SETTINGS_CHANGED_STATE, payload: true });
        break;
      }
      else {
        dispatch({ type: ACTIONS.SET_SETTINGS_CHANGED_STATE, payload: false });
      }
    }

  }, [ optionsStates ]);
  

  // FUNCTIONS

  const resetOptionsStates = () => {
    Object.keys(optionsStates).forEach(key => {
      optionsStates[key] = false;
    });
  }

  const confirmClearAllProducts = () => {
    dispatch({ type: ACTIONS.SET_CLEAR_ALL_PRODUCTS, payload: false });
    clearDatabase("productList");
  }

  const cancelClearAllProducts = () => {
    dispatch({ type: ACTIONS.SET_CLEAR_ALL_PRODUCTS, payload: false });
  }

  const confirmClearAllSeries = () => {
    dispatch({ type: ACTIONS.SET_CLEAR_ALL_SERIES, payload: false });
    clearDatabase("seriesList");
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

    // PERSONAL DATA VALIDATION
    const personalDataValues = [
      state.settingsData.account.username,
      state.settingsData.account.email,
      state.settingsData.account.password
    ];
    const personalDataKeys = [
      "username",
      "email",
      "password"
    ];
    let isValidatedSuccessfully = true;

    personalDataValues.forEach(((personalDataValue, index) => {
      console.log(isFieldTooShort(personalDataValue));
      if (!isFieldEmpty(personalDataValue)) {
        if (!isFieldTooShort(personalDataValue)) {
          if (!isFieldTooLong(personalDataValue)) {
            dispatch({ type: ACTIONS.SET_WARNING, payload: { field: personalDataKeys[index], warning: '' }});
          }
          else {
            dispatch({ type: ACTIONS.SET_WARNING, payload: { field: personalDataKeys[index], warning: warnings.maxLengthFail }});
            dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: personalDataKeys[index], value: "" }});
            isValidatedSuccessfully = false;
          }
        }
        else {
          dispatch({ type: ACTIONS.SET_WARNING, payload: { field: personalDataKeys[index], warning: warnings.minLengthFail }});
          dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: personalDataKeys[index], value: "" }});
          isValidatedSuccessfully = false;
        }
      }
      else {
        dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: personalDataKeys[index], value: "" }});
        dispatch({ type: ACTIONS.SET_WARNING, payload: { field: personalDataKeys[index], warning: warnings.emptyFail }});
        isValidatedSuccessfully = false;
      }

      if (personalDataKeys[index] === "email") {
        if (isEmailCorrect(personalDataValue)) {
          dispatch({ type: ACTIONS.CLEAR_WARNING, payload: personalDataValue });
        }
        else {
          dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: personalDataKeys[index], value: "" }});
          dispatch({ type: ACTIONS.SET_WARNING, payload: { field: personalDataKeys[index], warning: warnings.emailFail }});
          isValidatedSuccessfully = false;
        }
      }
    }));

    if (isValidatedSuccessfully)
      saveSettingsToDatabase();
    props.updateGauges();
    resetOptionsStates();
  }

  const handleSettingsCanceled = (e) => {
    e.preventDefault();
    getSettingsFromDatabase();
    resetOptionsStates();
    props.closeWindow();
  }

  const handleSettingsReset = (e) => {
    e.preventDefault();
    getSettingsFromDatabase();
    resetOptionsStates();
  }
  const isFieldTooShort = (field) => {
    if (field.length < 3)
      return true;
    else
      return false;
  }

  const isFieldTooLong = (field) => {
    if (field.length > 32)
      return true;
    else
      return false;
  }

  const isFieldEmpty = (field) => {
    if (field.length === 0)
      return true;
    else
      return false;
  }

  const isEmailCorrect = (email) => {
    const regEx = /^[\w.-]{3,}@{1}[\w.-]{1,}[.]{1}\w{1,}/i;
    if (regEx.test(email))
      return true;
    else
      return false;
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
    const isWord = /[a-z\s]/i;
    console.log(e.target.id);

    e.preventDefault();

    if (e.target.id === 'editMealName') {
      if (isWord.test(e.target.value[e.target.value.length - 1])) {
        dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, index: Number(e.target.attributes["data-key"].value), value: e.target.value }})
        dispatch({ type: ACTIONS.SET_WARNING, payload: { field: e.target.id, warning: "" } });
      }
      else {
        dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, index: Number(e.target.attributes["data-key"].value), value: ""}})
        dispatch({ type: ACTIONS.SET_WARNING, payload: { field: e.target.id, warning: warnings.editMealName } });
      }
    }
    
    if (isNumber.test(e.target.value[e.target.value.length - 1])) {
      if (isZero.test(e.target.value)) {
        dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, value: 1 }});
        dispatch({ type: ACTIONS.SET_WARNING, payload: { field: e.target.id, warning: warnings.isZero } });
      }
      else {
        dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, value: e.target.value }});
        dispatch({ type: ACTIONS.SET_WARNING, payload: { field: e.target.id, warning: "" } });
      }
    }

    else {
      dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, value: "" }});
      dispatch({ type: ACTIONS.SET_WARNING, payload: { field: e.target.id, warning: warnings.macros } });
    }

    if ((e.target.id === "username") || (e.target.id === "email") || (e.target.id === "password")) {
      dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, value: e.target.value }});
      dispatch({ type: ACTIONS.SET_WARNING, payload: { field: e.target.id, warning: "" } });
    }
  }

  const handleCheckboxOnClick = (e) => {
    setOptionsStates(prevOptions => { return {...prevOptions, [e.target.id]: !optionsStates[e.target.id]} });
  }
  
  const handleCategorySwitch = (e) => {
    e.preventDefault();
    dispatch({type: ACTIONS.SET_CATEGORY, payload: { category: 'isAccountCategory', value: false }});
    dispatch({type: ACTIONS.SET_CATEGORY, payload: { category: 'isNutritionCategory', value: false }});
    dispatch({type: ACTIONS.SET_CATEGORY, payload: { category: 'isTrainingCategory', value: false }});
    dispatch({type: ACTIONS.SET_CATEGORY, payload: { category: e.target.id, value: true }});
    getSettingsFromDatabase();
    resetOptionsStates();
  }


  // RETURN

  return ReactDOM.createPortal (
    <>
    <div className="window__closer" onClick={ handleSettingsCanceled }></div>
    <div className="window">
      <header className="window__header">
          
        <h2 className="window__header__heading">Settings</h2>

        <button className="window__header__back-button" onClick={ handleSettingsCanceled }><FaChevronCircleLeft /></button>        
        <button className="window__header__switch">
          <h3 
            className={ state.isAccountCategory 
                        ? "window__header__switch__left window__header__switch__left--selected"
                        : "window__header__switch__left" }
            id="isAccountCategory"
            onClick={ handleCategorySwitch }>
            Account
          </h3>

          <h3 
            className={ state.isNutritionCategory
                        ? "window__header__switch__center window__header__switch__center--selected"  
                        : "window__header__switch__center" }
            id="isNutritionCategory"
            onClick={ handleCategorySwitch }>
            Nutrition        
          </h3>
          
          <h3 
            className={ state.isTrainingCategory  
                        ? "window__header__switch__right window__header__switch__right--selected"  
                        : "window__header__switch__right" }
            id="isTrainingCategory"
            onClick={ handleCategorySwitch }>
            Training
          </h3>
        </button>

      </header>

      <main className="window__form">
        { state.isAccountCategory &&
          <form className="window__main window__main--add" onSubmit={ handleSettingsSaved }>
          
            <button 
              className={ state.isSettingsChanged
                          ? "window__header__add-button"
                          : "window__header__add-button window__header__add-button--disabled" }
              type="submit"
              style={{ zIndex: 11 }}
              disabled={ state.isSettingsChanged ? false : true }><FaSave />
            </button>
            
            <section className="window__main__section window__main__section--form">
              <h3 className="window__main__section__title">Personal data</h3>

              <div className="window__main__input-line">
                <label className="window__main__input-line__label" htmlFor="username">Username</label>
                <input
                  className="window__main__input-line__input"  
                  type="text" 
                  id="username"
                  value={ state.settingsData.account.username } 
                  onChange={ handleSettingOnChange }
                  placeholder={ state.warnings["username"] ? state.warnings["username"] : null }
                  maxLength="32"
                  required>
                </input>
              </div>

              <div className="window__main__input-line">
                <label className="window__main__input-line__label" htmlFor="email">E-mail</label>
                <input
                  className="window__main__input-line__input"  
                  type="email" 
                  id="email"
                  value={ state.settingsData.account.email } 
                  onChange={ handleSettingOnChange }
                  placeholder={ state.warnings["email"] ? state.warnings["email"] : null }
                  maxLength="32"
                  required>
                </input>
              </div>

              <div className="window__main__input-line">
                <label className="window__main__input-line__label" htmlFor="password">Password</label>
                <input
                  className="window__main__input-line__input"  
                  type="password" 
                  id="password"
                  value={ state.settingsData.account.password } 
                  onChange={ handleSettingOnChange }
                  placeholder={ state.warnings["password"] ? state.warnings["password"] : null }
                  maxLength="32"
                  required>
                </input>
              </div>
            </section>

            <section className="window__bottom">

              <button 
                  className={
                    state.isSettingsChanged
                    ? "window__bottom__tertiary-button"
                    : "window__bottom__tertiary-button window__bottom__tertiary-button--disabled"
                  } 
                  type="button"
                  onClick={ handleSettingsReset }
                  disabled={ state.isSettingsChanged ? false : true }>
                  Reset
              </button>

              <div>
                <button 
                  className="window__bottom__secondary-button"
                  type="button" 
                  onClick={ handleSettingsCanceled }>
                  Cancel
                </button>

                <button 
                  className={
                    state.isSettingsChanged
                    ? "window__bottom__primary-button"
                    : "window__bottom__primary-button window__bottom__primary-button--disabled" 
                  }
                  type="submit"
                  id="saveSettings"
                  value="Save"
                  disabled={ state.isSettingsChanged ? false : true }>
                  Save
                </button>
              </div>

          </section>
          </form>
        }

        { state.isNutritionCategory &&
          <form className="window__main window__main--add" onSubmit={ handleSettingsSaved }>
            
            <button 
              className={ state.isSettingsChanged
                          ? "window__header__add-button"
                          : "window__header__add-button window__header__add-button--disabled" }
              type="submit"
              style={{ zIndex: 11 }}
              disabled={ state.isSettingsChanged ? false : true }><FaSave />
            </button>
            
            <section className="window__main__section window__main__section--form">
              <h3 className="window__main__section__title">Daily demand</h3>

              <div className="window__main__input-line">
                <label className="window__main__input-line__label" htmlFor="proteins">Proteins</label>
                <input
                  className="window__main__input-line__input"  
                  type="text" 
                  id="proteins"
                  value={ state.settingsData.nutrition.dailyDemand.proteins } 
                  onChange={ handleSettingOnChange }
                  placeholder={ state.warnings["proteins"] ? state.warnings["proteins"] : null }
                  maxLength="4"
                  required>
                </input>
                <span className="window__main__input-line__unit">g</span>
              </div>

              <div className="window__main__input-line">
                <label className="window__main__input-line__label" htmlFor="fats">Fats</label>
                <input
                  className="window__main__input-line__input"  
                  type="text" 
                  id="fats"
                  value={ state.settingsData.nutrition.dailyDemand.fats } 
                  onChange={ handleSettingOnChange }
                  placeholder={ state.warnings["fats"] ? state.warnings["fats"] : null }
                  maxLength="4"
                  required>
                </input>
                <span className="window__main__input-line__unit">g</span>
              </div>

              <div className="window__main__input-line">
                <label className="window__main__input-line__label" htmlFor="carbs">Carbohydrates</label>
                <input
                  className="window__main__input-line__input"  
                  type="text" 
                  id="carbs"
                  value={ state.settingsData.nutrition.dailyDemand.carbs } 
                  onChange={ handleSettingOnChange }
                  placeholder={ state.warnings["carbs"] ? state.warnings["carbs"] : null }
                  maxLength="4"
                  required>
                </input>
                <span className="window__main__input-line__unit">g</span>
              </div>

              <div className="window__main__input-line">
                <label className="window__main__input-line__label" htmlFor="kcal">Calories</label>
                <input
                  className="window__main__input-line__input"  
                  type="text" 
                  id="kcal"
                  value={ state.settingsData.nutrition.dailyDemand.kcal } 
                  onChange={ handleSettingOnChange }
                  placeholder={ state.warnings["kcal"] ? state.warnings["kcal"] : null }
                  maxLength="4"
                  required>
                </input>
                <span className="window__main__input-line__unit">kcal</span>
              </div>
            </section>

            <section className="window__main__section window__main__section--form">
              <h3 className="window__main__section__title">Meals</h3>

              <div className="window__main__input-line">
                <label className="window__main__input-line__label" htmlFor="setMealsNumber">Number of meals</label>
                <input
                  className="window__main__input-line__input"  
                  type="text" 
                  id="setMealsNumber"
                  value={ state.settingsData.nutrition.numberOfMeals } 
                  onChange={ handleSettingOnChange }
                  placeholder={ state.warnings["setMealsNumber"] ? state.warnings["setMealsNumber"] : null }
                  maxLength="1"
                  required>
                </input>
                <span className="window__main__input-line__unit">meals</span>
              </div>
              
              { Object.values(state.settingsData.nutrition.namesOfMeals).map((meal, index) => {
                if (state.settingsData.nutrition.numberOfMeals > index) {
                  return (
                    <div key={ index } className="window__main__input-line">
                      <label className="window__main__input-line__label" htmlFor="editMealName">{`Set meal nr ${ index + 1 } name`}</label>
                      <input 
                        className="window__main__input-line__input"
                        data-key={ index } 
                        type="text" 
                        id="editMealName"
                        value={ state.settingsData.nutrition.namesOfMeals[index] } 
                        onChange={ handleSettingOnChange }
                        placeholder={ state.warnings["editMealName"] ? state.warnings["editMealName"] : null }
                        required>
                      </input>
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

            <section className="window__main__section window__main__section--form">
              <h3 className="window__main__section__title">Options</h3>

              <div className="window__main__input-line">
                <label className="window__main__input-line__label window__main__input-line__label--checkbox" htmlFor="clearAllProducts">Clear all products</label>
                <button 
                  className="window__main__input-line__checkbox"
                  id="clear-all-products"
                  type="button"
                  onClick={ handleCheckboxOnClick }>
                  <div 
                    className="window__main__input-line__checkbox__background" 
                    id="clear-all-products"
                    style={ optionsStates["clear-all-products"] ? {backgroundColor: "#7500AF"} : {backgroundColor: "transparent"} }>
                  </div>
                </button>
              </div>

              <div className="window__main__input-line">
                <label className="window__main__input-line__label window__main__input-line__label--checkbox" htmlFor="resetNutritionSettingsToInitial">Reset nutrition settings to initial</label>
                <button 
                  className="window__main__input-line__checkbox"
                  id="reset-nutrition-to-initial"
                  type="button"
                  onClick={ handleCheckboxOnClick }>
                  <div 
                    className="window__main__input-line__checkbox__background" 
                    id="reset-nutrition-to-initial"
                    style={ optionsStates["reset-nutrition-to-initial"] ? {backgroundColor: "#7500AF"} : {backgroundColor: "transparent"} }>
                  </div>
                </button>
              </div>
            
            </section>

            <section className="window__bottom">

              <button 
                  className={
                    state.isSettingsChanged
                    ? "window__bottom__tertiary-button"
                    : "window__bottom__tertiary-button window__bottom__tertiary-button--disabled"
                  } 
                  type="button"
                  onClick={ handleSettingsReset }
                  disabled={ state.isSettingsChanged ? false : true }>
                  Reset
              </button>

              <div>
                <button 
                  className="window__bottom__secondary-button"
                  type="button" 
                  onClick={ handleSettingsCanceled }>
                  Cancel
                </button>

                <button 
                  className={
                    state.isSettingsChanged
                    ? "window__bottom__primary-button"
                    : "window__bottom__primary-button window__bottom__primary-button--disabled" 
                  }
                  type="submit"
                  id="saveSettings"
                  value="Save"
                  disabled={ state.isSettingsChanged ? false : true }>
                  Save
                </button>
              </div>

          </section>
          </form>
        }

        { state.isTrainingCategory &&
          <form className="window__main window__main--add" onSubmit={ handleSettingsSaved }>
          
            <button 
              className={ state.isSettingsChanged
                          ? "window__header__add-button"
                          : "window__header__add-button window__header__add-button--disabled" }
              type="submit"
              style={{ zIndex: 11 }}
              disabled={ state.isSettingsChanged ? false : true }><FaSave />
            </button>
            
            <section className="window__main__section window__main__section--form">
              
              <h3 className="window__main__section__title">Exercises</h3>
              
              { exercises.map(exercise => {
                  return (
                    <div key={ exercise.id } className="window__main__input-line">
                      <label className="window__main__input-line__label window__main__input-line__label--checkbox" htmlFor={"exercise"+ exercise.id }>{ exercise.name }</label>
                      <button 
                        className="window__main__input-line__checkbox"
                        id={"exercise"+ exercise.id }
                        type="button"
                        onClick={ handleExerciseChoosing }>
                        <div 
                          className="window__main__input-line__checkbox__background" 
                          id={"exercise"+ exercise.id }
                          style={ state.settingsData.training.selectedExercises.includes(exercise.id) ? {backgroundColor: "#7500AF"} : {backgroundColor: "transparent"} }>
                        </div>
                      </button>
                    </div>
                  )}) 
                }

            </section>

            <section className="window__main__section window__main__section--form">
              <h3 className="window__main__section__title">Options</h3>

              <div className="window__main__input-line">
                <label className="window__main__input-line__label window__main__input-line__label--checkbox" htmlFor="clear-all-series">Clear all series</label>
                <button 
                  className="window__main__input-line__checkbox"
                  id="clear-all-series"
                  type="button"
                  onClick={ handleCheckboxOnClick }>
                  <div 
                    className="window__main__input-line__checkbox__background" 
                    id="clear-all-series"
                    style={ optionsStates["clear-all-series"] ? {backgroundColor: "#7500AF"} : {backgroundColor: "transparent"} }>
                  </div>
                </button>
              </div>

              <div className="window__main__input-line">
                <label className="window__main__input-line__label window__main__input-line__label--checkbox" htmlFor="reset-training-to-initial">Reset training settings to initial</label>
                <button 
                  className="window__main__input-line__checkbox"
                  id="reset-training-to-initial"
                  type="button"
                  onClick={ handleCheckboxOnClick }>
                  <div 
                    className="window__main__input-line__checkbox__background" 
                    id="reset-training-to-initial"
                    style={ optionsStates["reset-training-to-initial"] ? {backgroundColor: "#7500AF"} : {backgroundColor: "transparent"} }>
                  </div>
                </button>
              </div>
            
            </section>

            <section className="window__bottom">

              <button 
                  className={
                    state.isSettingsChanged
                    ? "window__bottom__tertiary-button"
                    : "window__bottom__tertiary-button window__bottom__tertiary-button--disabled"
                  } 
                  type="button"
                  onClick={ handleSettingsReset }
                  disabled={ state.isSettingsChanged ? false : true }>
                  Reset
              </button>

              <div>
                <button 
                  className="window__bottom__secondary-button"
                  type="button" 
                  onClick={ handleSettingsCanceled }>
                  Cancel
                </button>

                <button 
                  className={
                    state.isSettingsChanged
                    ? "window__bottom__primary-button"
                    : "window__bottom__primary-button window__bottom__primary-button--disabled" 
                  }
                  type="submit"
                  id="saveSettings"
                  value="Save"
                  disabled={ state.isSettingsChanged ? false : true }>
                  Save
                </button>
              </div>

          </section>
          </form>
        }
      </main>
    </div>

    { state.clearAllSeries && 
      <section className="window window--login">
        <header className="window__header">
          <h2 className="window__header__heading">Clear all?</h2> 
        </header>

        <main className="window__main">
          <h3 className="window__main__message">Are you sure you want to clear all series?</h3>
        </main>

        <section className="window__bottom">
          <button className="window__bottom__secondary-button" onClick={ cancelClearAllSeries }>Cancel</button>
          <button className="window__bottom__primary-button" onClick={ confirmClearAllSeries }>Remove</button>
        </section>
      </section>
    }

    { state.clearAllProducts &&
      <section className="window window--login">
        <header className="window__header">
          <h2 className="window__header__heading">Clear all?</h2> 
        </header>

        <main className="window__main">
          <h3 className="window__main__message">Are you sure you want to clear all products?</h3>
        </main>

        <section className="window__bottom">
          <button className="window__bottom__secondary-button" onClick={ cancelClearAllProducts }>Cancel</button>
          <button className="window__bottom__primary-button" onClick={ confirmClearAllProducts }>Remove</button>
        </section>
      </section>
    }

    </>,
    document.getElementById("portal")
  )
}