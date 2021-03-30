// IMPORTS

import { React, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { Logo, Title, MenuItem, Quotation } from './components/left/left';
import DateChanger from './components/center/DateChanger';
import Meal from './components/meal/Meal';
import Gauge from './components/right/Gauge';

import './styles/index/index.css';
import './components/left/styles/left.css';
import './components/center/styles/center.css';
import './components/right/styles/right.css';


// GLOBALS

const MENU_CATEGORIES= ["Log in", "Nutrition", "Training", "Settings", "About"];
const ACTIONS = {
  UPDATE_MEALS_INGREDIENTS_SUMMARY: 'update-meals-ingredients-summary',
  UPDATE_DAILY_INGREDIENTS_SUMMARY: 'update-daily-ingredients-summary',
  COUNT_GAUGES_DATA: 'count-gauges-data',
  CHANGE_DATE: 'change-date',
  CHANGE_PAGE_TITLE: 'change-page-title',
  CHANGE_SETTINGS_DATA: 'change-settings-data',
  BACKUP_OLD_SETTINGS: 'backup-old-settings',
  RESTORE_OLD_SETTINGS: 'restore-old-settings',
  LOAD_SETTINGS: 'load-settings'
}


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


// COMPONENTS

function App() {
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
        return {...state, pageTitle: action.payload};
      }

      case ACTIONS.BACKUP_OLD_SETTINGS: {
        return {...state, oldSettingsData: state.settingsData};
      }

      case ACTIONS.RESTORE_OLD_SETTINGS: {
        return {...state, settingsData: state.oldSettingsData};
      }

      case ACTIONS.CHANGE_SETTINGS_DATA: {
        switch (action.payload.key) {
          case 'clearAllProducts': {
            return {...state, 
              settingsData: { ...state.settingsData, 
              nutrition: {...state.settingsData.nutrition,
              clearAllProducts: action.payload.value }}
            };
          };

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

      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }

  const initialState = {
    dateIds: { dayId: 0, monthId: 0, yearId: 0 },
    pageTitle: 'Settings',
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
        dailyDemand: { kcal: 0, proteins: 0, fats: 0, carbs: 0 },
        namesOfMeals: { 0: "Breakfast", 1: "II Breakfast", 2: "Lunch", 3: "Snack", 4: "Dinner", 5: "", 6: "", 7: "", 8: "", 9: "" },
        numberOfMeals: 5,
        clearAllProducts: false
      },

      training: {

      }
    },
    oldSettingsData: {}
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    updateGauges();
    if (Object.keys(localStorage) !== 0)
      dispatch({ type: ACTIONS.LOAD_SETTINGS });
  }, [ state.dateIds ]);

  useEffect(() => {
    if (state.pageTitle === 'Settings')
      dispatch({ type: ACTIONS.BACKUP_OLD_SETTINGS });
      
  }, [ state.pageTitle ]);

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

    dispatch({type: ACTIONS.CHANGE_PAGE_TITLE, payload: newPageTitle })
    dispatch({ type: ACTIONS.RESTORE_OLD_SETTINGS });
  }

  const handleMenu = (categoryTitle) => {
    changePageTitle(categoryTitle);
  }

  const resetCheckbox = (idOfCheckbox) => {
    document.querySelector("#" + idOfCheckbox).checked = false;
  }

  const saveSettingsToLocalStorage = () => {
    localStorage.setItem("settings", JSON.stringify(state.settingsData));
  }

  const restoreSettingsFromBackup = () => {
    dispatch({ type: ACTIONS.RESTORE_OLD_SETTINGS });
  }

  const confirmClearAllProducts = () => {
    dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: 'clearAllProducts', value: false } });

    Object.keys(localStorage).forEach(key => {
      if (key !== "settings")
        localStorage.removeItem(key);
    });
    
    resetCheckbox("clearAllProducts");
    updateGauges();
  }

  const cancelClearAllProducts = () => {
    dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: 'clearAllProducts', value: false } });
    resetCheckbox("clearAllProducts");
    updateGauges();
  }

  const handleSettingsSaved = (e) => {
    e.preventDefault();

    saveSettingsToLocalStorage();

    if (e.target[4].checked === true) {
      dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: 'clearAllProducts', value: true } });
    }

    else {
      dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: 'clearAllProducts', value: false } });
      resetCheckbox("clearAllProducts");
    }

    updateGauges();
  }

  const handleSettingsCanceled = (e) => {
    e.preventDefault();

    restoreSettingsFromBackup();
    saveSettingsToLocalStorage();

    resetCheckbox("clearAllProducts");
    updateGauges();
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

    updateGauges();
  }

  return (
    <div className="wrapper">


      <aside className="left-section">

        <header className="left-section__logo-container">
          <Logo />
          <Title />
        </header>

        <ul className="left-section__menu-container">

          { MENU_CATEGORIES.map((category, index) => {
              return <MenuItem key={ index } value={ category } href="" isActive={ false } linkTo={ handleMenu } />
            })
          }

        </ul>

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

        {state.settingsData.nutrition.clearAllProducts && 
          <>
            <div>Are you sure?</div>
            <button onClick={ confirmClearAllProducts }>Yes</button>
            <button onClick={ cancelClearAllProducts }>No</button>
          </>
        }

        { state.pageTitle === 'Log in' &&

          <h2>Log in</h2>
        
        }

        { state.pageTitle === 'Dashboard' && 

          Object.values(state.settingsData.nutrition.namesOfMeals).map((meal, index) => {
            if (state.settingsData.nutrition.numberOfMeals > index)
              return <Meal key={ index } name={ meal } mealId={ index } dateIds={ state.dateIds } updateGauges={ updateMealSummary } />
            })

        }

        { state.pageTitle === 'Training' &&

          <h2>Training</h2>
        
        }

        { state.pageTitle === 'Settings' &&
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
                  <label htmlFor="setMealsNumber">Set number of meals: </label>
                  <input 
                    type="text" 
                    id="setMealsNumber"
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

              <input 
                className="center-section__main__settings__form__submit-button"
                type="submit" 
                value="Save" 
                id="saveSettings"/>

              <button 
                className="center-section__main__settings__form__cancel-button"
                onClick={ handleSettingsCanceled } 
                disabled={ state.oldSettingsData === state.settingsData ? true : false }>
                Cancel
              </button>

            </form>

          </section>
        }

        { state.pageTitle === 'About' &&

          <h2>About</h2>
        
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
  )
}


// RENDERING

ReactDOM.render(<App />, document.querySelector("#root"));