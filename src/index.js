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

const MEALS = ["Breakfast", "II Breakfast", "Lunch", "Snack", "Dinner"];
const DAILY_DEMAND = { kcal: 2000, proteins: 120, fats: 55, carbs: 240 };
const ACTIONS = {
  UPDATE_MEALS_INGREDIENTS_SUMMARY: 'update-meals-ingredients-summary',
  UPDATE_DAILY_INGREDIENTS_SUMMARY: 'update-daily-ingredients-summary',
  COUNT_GAUGES_DATA: 'count-gauges-data',
  CHANGE_DAY: 'change-day'
}

const countPercentOfEatenIngredient = (eatenAmount, maxAmount) => {
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
            left: countAmountOfIngredientLeft(state.dailyIngredientsSummary[ingredient], DAILY_DEMAND[ingredient]), 
            max: DAILY_DEMAND[ingredient], 
            percent: countPercentOfEatenIngredient(state.dailyIngredientsSummary[ingredient], DAILY_DEMAND[ingredient]) }
          }
        }
      }

      case ACTIONS.CHANGE_DAY: {
        return {...state, dayId: action.payload};
      }

      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }

  const initialState = {
    dayId: 0,
    mealsIngredientsSummary: [],
    dailyIngredientsSummary: {},
    gaugesData: {
      kcal: { eaten: 0, left: 0, max: 0, percent: 0 },
      proteins: { eaten: 0, left: 0, max: 0, percent: 0 },
      fats: { eaten: 0, left: 0, max: 0, percent: 0 },
      carbs: { eaten: 0, left: 0, max: 0, percent: 0 }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const updateMealSummary = (object, mealId) => {
    dispatch({ type: ACTIONS.UPDATE_MEALS_INGREDIENTS_SUMMARY, payload: {data: object, mealId: mealId} });
    updateDailySummary();
  } 

  const updateDailySummary = () => {
    dispatch({ type: ACTIONS.UPDATE_DAILY_INGREDIENTS_SUMMARY });
    updateGauges();
  }

  const updateGauges = () => {
    Object.keys(DAILY_DEMAND).forEach(ingredient => {
      dispatch({ type: ACTIONS.COUNT_GAUGES_DATA, payload: { typeOfIngredient: ingredient} });
    });
  }

  const handleDayChanging = (newDayId) => {
    dispatch({type: ACTIONS.CHANGE_DAY, payload: newDayId })
  }

  return (
    <div className="wrapper">


      <aside className="left-section">

        <header className="left-section__logo-container">
          <Logo />
          <Title />
        </header>

        <ul className="left-section__menu-container">
          <MenuItem value="Log in" href="#" isActive={true} />
          <MenuItem value="Settings" href="#" isActive={false} />
          <MenuItem value="Training" href="#" isActive={false} />
          <MenuItem value="About" href="#" isActive={false} />
        </ul>

        <h2 className="left-section__quotation-container">
          <Quotation />
        </h2>
        
      </aside>


      <main className="center-section">


        <section className="center-section__top">
        
          <h3 className="center-section__top__title">Dashboard</h3>
          <DateChanger changeDay={ handleDayChanging } />

        </section>

      
        <section className="center-section__meals">

        <Meal name="Breakfast"    mealId={0} dayId={ state.dayId } updateGauges={ updateMealSummary } />
        <Meal name="II Breakfast" mealId={1} dayId={ state.dayId } updateGauges={ updateMealSummary } />
        <Meal name="Lunch"        mealId={2} dayId={ state.dayId } updateGauges={ updateMealSummary } />
        <Meal name="Snack"        mealId={3} dayId={ state.dayId } updateGauges={ updateMealSummary } />
        <Meal name="Dinner"       mealId={4} dayId={ state.dayId } updateGauges={ updateMealSummary } />

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