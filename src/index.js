// IMPORTS

import { React, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { Logo, Title, Hamburger, MenuItem, Quotation } from './components/left/left';
import DateChanger from './components/center/DateChanger';
import Meal from './components/meal/Meal';
import Gauge from './components/right/Gauge';
import Exercise from './components/exercise/Exercise';
import Settings from './components/settings/Settings';
import About from './components/about/About';
import Login from './components/login/Login';
import { exercises } from './exercisesList';

import logo from '../src/logo_white.png';
import './styles/index/index.css';
import './components/left/styles/left.css';
import './components/center/styles/center.css';
import './components/right/styles/right.css';


// FUNCTIONS

const countPercentOfEatenIngredient = (eatenAmount, maxAmount) => {
  if (Number.isNaN((Math.round(eatenAmount / maxAmount * 100))))
    return 0;
  else
  return Math.round(eatenAmount / maxAmount * 100);
}

const countAmountOfIngredientLeft = (eatenAmount, maxAmount) => {
  if (eatenAmount >= maxAmount)
    return 0;
  else
    return maxAmount - eatenAmount;
}


// VARIABLES

const ACTIONS = {
  UPDATE_MEALS_INGREDIENTS_SUMMARY: 'update-meals-ingredients-summary',
  UPDATE_DAILY_INGREDIENTS_SUMMARY: 'update-daily-ingredients-summary',
  COUNT_GAUGES_DATA: 'count-gauges-data',
  CHANGE_DATE: 'change-date',
  CHANGE_PAGE_TITLE: 'change-page-title',
  LOAD_SETTINGS: 'load-settings',
  SET_LOGIN_WINDOW: 'set-login-window',
  SET_USER_STATUS: 'set-user-status',
  CHANGE_HAMBURGER_STATE: 'change-hamburger-state',
  UPDATE_WINDOW_WIDTH: 'update-window-width'
}

const initialState = {
  dateIds: { dayId: 0, monthId: 0, yearId: 0 },
  pageTitle: 'Dashboard',
  previousPageTitle: 'Dashboard',
  isLoginWindowsEnabled: false,
  isAddWindowsEnabled: false,
  isRemoveWindowsEnabled: false,
  isMoreWindowsEnabled: false,
  hamburgerState: false,
  windowWidth: window.innerWidth,
  userStatus: "Log in",
  mealsIngredientsSummary: [],
  dailyIngredientsSummary: { kcal: 0, proteins: 0, fats: 0, carbs: 0 },
  gaugesData: {
    kcal: { eaten: 0, left: 0, max: 0, percent: 0 },
    proteins: { eaten: 0, left: 0, max: 0, percent: 0 },
    fats: { eaten: 0, left: 0, max: 0, percent: 0 },
    carbs: { eaten: 0, left: 0, max: 0, percent: 0 }
  },

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
}


// COMPONENTS

function App() {

  // HOOKS

  const reducer = (state, action) => {
    switch (action.type) {

      case ACTIONS.UPDATE_MEALS_INGREDIENTS_SUMMARY: {
        const newMealsIngredientsSummary = [...state.mealsIngredientsSummary];

        newMealsIngredientsSummary[action.payload.mealId] = {
                                                              proteins: action.payload.data.proteins,
                                                              fats: action.payload.data.fats, 
                                                              carbs: action.payload.data.carbs, 
                                                              kcal: action.payload.data.kcal };

        return {...state, mealsIngredientsSummary: newMealsIngredientsSummary};                                                                 
      }

      case ACTIONS.UPDATE_DAILY_INGREDIENTS_SUMMARY: {
        let dailyIngredientsSum = { proteins: 0, fats: 0, carbs: 0, kcal: 0 };
        let mealsIngredientsSum = { proteins: 0, fats: 0, carbs: 0, kcal: 0 };

        state.mealsIngredientsSummary.forEach(meal => {
          mealsIngredientsSum = {
                                  proteins: meal.proteins,
                                  fats:     meal.fats,
                                  carbs:    meal.carbs,
                                  kcal:     meal.kcal };

          dailyIngredientsSum = {
                                  proteins: dailyIngredientsSum.proteins + mealsIngredientsSum.proteins,
                                  fats:     dailyIngredientsSum.fats     + mealsIngredientsSum.fats,
                                  carbs:    dailyIngredientsSum.carbs    + mealsIngredientsSum.carbs,
                                  kcal:     dailyIngredientsSum.kcal     + mealsIngredientsSum.kcal };

          mealsIngredientsSum = { proteins: 0,
                                  fats: 0,
                                  carbs: 0,
                                  kcalS: 0 };
        });

        return {...state, dailyIngredientsSummary: dailyIngredientsSum };
      }

      case ACTIONS.COUNT_GAUGES_DATA: {
        const ingredient = action.payload.typeOfIngredient;

        return {...state, gaugesData: {...state.gaugesData, 
          [ingredient]: { 
            eaten: state.dailyIngredientsSummary[ingredient], 
            left: countAmountOfIngredientLeft(state.dailyIngredientsSummary[ingredient], state.settingsData.nutrition.dailyDemand[ingredient]), 
            max: state.settingsData.nutrition.dailyDemand[ingredient], 
            percent: countPercentOfEatenIngredient(state.dailyIngredientsSummary[ingredient], state.settingsData.nutrition.dailyDemand[ingredient]) }
          }
        }
      }

      case ACTIONS.CHANGE_DATE: {
        return {...state, dateIds: { dayId: action.payload.currentDay,  
                                     monthId: action.payload.currentMonth,
                                     yearId: action.payload.currentYear }};
      }

      case ACTIONS.CHANGE_PAGE_TITLE: {
        return {...state, previousPageTitle: state.pageTitle, pageTitle: action.payload};
      }
      
      case ACTIONS.LOAD_SETTINGS: {
        let newSettings = JSON.parse(localStorage.getItem("settings"));
        return {...state, settingsData: newSettings }
      }

      case ACTIONS.SET_LOGIN_WINDOW: {
        return {...state, isLoginWindowsEnabled: action.payload}
      }

      case ACTIONS.SET_USER_STATUS: {
        return {...state, userStatus: action.payload}
      }

      case ACTIONS.CHANGE_HAMBURGER_STATE: {
        return { ...state, hamburgerState: action.payload }
      }

      case ACTIONS.UPDATE_WINDOW_WIDTH: {
        return { ...state, windowWidth: window.innerWidth };
      }

      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  

  // VARIABLES

  const MENU_CATEGORIES = [state.userStatus, "Nutrition", "Training", "Settings", "About"];


  // EFFECTS

  // WINDOW WIDTH STUFF
  useEffect(() => {

    // WINDOW REAL HEIGHT COUNTING
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener("resize", () => {
      dispatch({ type: ACTIONS.UPDATE_WINDOW_WIDTH });
      dispatch({ type: ACTIONS.CHANGE_HAMBURGER_STATE, payload: false });

      // WINDOW REAL HEIGHT COUNTING AFTER RESIZING
      vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

  }, []);

  // UPDATES GAUGES AFTER DATE CHANGE
  useEffect(() => { 
    updateGauges();

  }, [ state.dateIds ]);

  // CHECKS IF SETTINGS ARE SAVED IN LOCAL STORAGE
  useEffect(() => {
    const localStorageKeys = Object.keys(localStorage);
    if (localStorageKeys.includes("settings"))
      dispatch({ type: ACTIONS.LOAD_SETTINGS });   
    else
      saveSettingsToLocalStorage();

    updateGauges();

  }, []);

  // BLURING AND DISABLING POINTER EVENTS ON BACKGROUND AFTER LOG IN WINDOW MOUNTING 
  useEffect(() => {
    const wrapper = document.querySelector(".wrapper");

    if (state.isLoginWindowsEnabled) {
      wrapper.style.filter = "blur(5px) opacity(40%) grayscale(100%)";
      wrapper.style.pointerEvents = "none";

      if (state.hamburgerState)
        dispatch({ type: ACTIONS.CHANGE_HAMBURGER_STATE, payload: false });
    }
    else {
      wrapper.style.filter = "blur(0px) opacity(100%) grayscale(0%)";
      wrapper.style.pointerEvents = "auto";
    }

  }, [ state.isLoginWindowsEnabled ]);


  useEffect(() => {
    const wrapper = document.querySelector(".wrapper");
    const menu = document.querySelector(".left-section__menu-container");
    const hamburger = document.querySelector(".left-section__hamburger");
    const hamburgerLines = document.querySelectorAll(".left-section__hamburger__line");

    if (state.windowWidth < 769) {
      if (state.hamburgerState) {
        wrapper.style.filter = "blur(5px) opacity(40%) grayscale(100%)";
        wrapper.style.pointerEvents = "none";
        menu.style.display = "flex";
        menu.style.right = 0;
        hamburger.style.right = 200 - 28 - 15 + "px";
        hamburgerLines[0].style.cssText ="left: 0px; background: #FFFFFF; width: 100%; transform: rotate(45deg); border-radius: 10px";
        hamburgerLines[1].style.cssText ="left: 10px; background: #FFFFFF; visibility: hidden";
        hamburgerLines[2].style.cssText ="left: 0px; background: #FFFFFF; width: 100%; transform: rotate(-45deg); border-radius: 10px";
      }

      else {
        menu.style.display = "none";
        menu.style.right = "-200px";
        hamburger.style.right = "10px"
        hamburgerLines[0].style.cssText ="left: 0px; background: #7500AF; width: 8px; transform: rotate(0deg); border-radius: 50%";
        hamburgerLines[1].style.cssText ="left: 10px; background: #7500AF; visibility: visible";
        hamburgerLines[2].style.cssText ="left: 20px; background: #7500AF; width: 8px; transform: rotate(0deg); border-radius: 50%";
        
        if (!state.isLoginWindowsEnabled && (state.pageTitle === "Dashboard" || state.pageTitle === "Training")) {
          wrapper.style.filter = "blur(0px) opacity(100%) grayscale(0%)";
          wrapper.style.pointerEvents = "auto";
        }
      }
    }
  }, [ state.hamburgerState ])

  


  // FUNCTIONS

  const updateMealSummary = (object, mealId) => {
    dispatch({ type: ACTIONS.UPDATE_MEALS_INGREDIENTS_SUMMARY, payload: {data: object, mealId: mealId} });
    updateDailySummary();
  } 

  const updateDailySummary = () => {
    dispatch({ type: ACTIONS.UPDATE_DAILY_INGREDIENTS_SUMMARY });
    updateGauges();
  }

  const updateGauges = () => {
    Object.keys(state.settingsData.nutrition.dailyDemand).forEach(ingredient => {
      dispatch({ type: ACTIONS.COUNT_GAUGES_DATA, payload: { typeOfIngredient: ingredient} });
    });
  }

  const updateDateIds = (newDateIds) => {
    dispatch({type: ACTIONS.CHANGE_DATE, payload: newDateIds })
  }

  const changePageTitle = (categoryTitle) => {
    let newPageTitle = '';

    if (categoryTitle === 'Nutrition')
      newPageTitle = 'Dashboard';
    else
      newPageTitle = categoryTitle;

    dispatch({type: ACTIONS.CHANGE_PAGE_TITLE, payload: newPageTitle });
    dispatch({ type: ACTIONS.CHANGE_HAMBURGER_STATE, payload: false });
    dispatch({ type: ACTIONS.LOAD_SETTINGS });
      
    updateGauges();
  }

  const handleMenu = (categoryTitle) => {
    if (categoryTitle === state.userStatus)
      dispatch({ type: ACTIONS.SET_LOGIN_WINDOW, payload: true });

    else
      changePageTitle(categoryTitle);
  }

  const saveSettingsToLocalStorage = () => {
    localStorage.setItem("settings", JSON.stringify(state.settingsData));
  }

  const disableLoginWindows = () => {
    dispatch({ type: ACTIONS.SET_LOGIN_WINDOW, payload: false }); 
  }

  const setUserStatus = (newStatus) => {
    dispatch({ type: ACTIONS.SET_USER_STATUS, payload: newStatus });
  }

  const handleHamburger = () => {
    if (state.hamburgerState)
      dispatch({ type: ACTIONS.CHANGE_HAMBURGER_STATE, payload: false });
    else  
      dispatch({ type: ACTIONS.CHANGE_HAMBURGER_STATE, payload: true });
  }

  
  // RETURN

  return (
    <>

    { state.isLoginWindowsEnabled &&
          <Login 
            setUserStatus={ setUserStatus } 
            disableLoginWindows={ disableLoginWindows } 
            isLogout={ state.userStatus === "Logged" ? true : false }
          /> 
    }

    <Hamburger handleHamburger={ handleHamburger } />

    { state.windowWidth < 769 &&
      <>
      <div className="left-section__menu-container__closer" onClick={ state.hamburgerState ? handleHamburger : null }></div>
      <ul className="left-section__menu-container">

        { MENU_CATEGORIES.map((category, index) => {
            return <MenuItem key={ index } value={ category } href="" isActive={ false } linkTo={ handleMenu } />
          })
        }

        <div className="left-section__menu-container__logo">
          <img src={ logo } alt="Dietapp logo"></img>
        </div>

      </ul>
      </>
    }

    <div className="wrapper">

      <aside className="left-section">

        <header className="left-section__logo-container">
          <Logo />
          <Title />
        </header>

        { state.windowWidth > 768 && 
          <ul className="left-section__menu-container">

            { MENU_CATEGORIES.map((category, index) => {
                return <MenuItem key={ index } value={ category } href="" isActive={ false } linkTo={ handleMenu } />
              })
            }

          </ul>
        }
        
        <h2 className="left-section__quotation-container">
          <Quotation />
        </h2>
        
      </aside>


      <main className="center-section">

        <section className="center-section__top">
        
          <h3 className="center-section__top__title">{ state.pageTitle }</h3>

          { ((state.pageTitle === 'Dashboard') || (state.pageTitle === 'Training')) && 
            <DateChanger changeDate={ updateDateIds } />
          }

        </section>

      
        <section className="center-section__main">

        { state.pageTitle === 'Training' &&

          state.settingsData.training.selectedExercises.map(selectedExerciseId => {
            return (
              <Exercise
                key={ selectedExerciseId } 
                exerciseId={ selectedExerciseId } 
                dateIds={ state.dateIds } 
                name={ exercises[selectedExerciseId].name } 
                difficulty={ exercises[selectedExerciseId].difficulty } 
                description={ exercises[selectedExerciseId].description } 
                muscles={ exercises[selectedExerciseId].muscles } 
                typeOfExercise={ exercises[selectedExerciseId].typeOfExercise } 
                properFormLink={ exercises[selectedExerciseId].properFormLink }>
              </Exercise>
            )})
        }

        { state.pageTitle === 'Dashboard' && 

          Object.values(state.settingsData.nutrition.namesOfMeals).map((meal, index) => {
            if (state.settingsData.nutrition.numberOfMeals > index)
              return <Meal key={ index } name={ meal } mealId={ index } dateIds={ state.dateIds } updateGauges={ updateMealSummary } />
            })

        }

        { state.pageTitle === 'Settings' &&

          <>
          <Settings 
            initialData={ initialState.settingsData }
            updateGauges={ updateGauges } 
            pageTitle={ state.pageTitle } 
            previousPage={ state.previousPageTitle }
            changePageTitle={ changePageTitle } />
          </>

        }

        { state.pageTitle === 'About' &&

          <About previousPage={ state.previousPageTitle } changePageTitle={ changePageTitle } />
        
        }

        </section>


      </main>


      <aside className="right-section">

        <Gauge 
          amount={ state.gaugesData.kcal.eaten }
          name="kcal"
          percent={ state.gaugesData.kcal.percent }
          left={ state.gaugesData.kcal.left }
          isKcal={true} />

        <Gauge 
          amount={ state.gaugesData.proteins.eaten }
          name="proteins" 
          percent={ state.gaugesData.proteins.percent }
          left={ state.gaugesData.proteins.left } />
        
        <Gauge 
          amount={ state.gaugesData.fats.eaten }
          name="fats" 
          percent={ state.gaugesData.fats.percent }
          left={ state.gaugesData.fats.left } />
        
        <Gauge 
          amount={ state.gaugesData.carbs.eaten }   
          name="carbohydrates" 
          percent={ state.gaugesData.carbs.percent }
          left={ state.gaugesData.carbs.left } />

      </aside>


    </div>
    </>
  )
}


// RENDERING

ReactDOM.render(<App />, document.querySelector("#root"));