// IMPORTS

import React from 'react';
import ReactDOM from 'react-dom';

import { Logo, Title, MenuItem, Quotation } from './components/left/left';
import DateChanger from './components/center/DateChanger';
import Meal from './components/meal/Meal';
import Gauge from './components/right/Gauge';

import './styles/index/index.css';
import './components/left/styles/left.css';
import './components/center/styles/center.css';
import './components/right/styles/right.css';
import { useReducer } from 'react';

const ACTIONS = {
  UPDATE_MEALS_INGREDIENTS_SUMMARY: 'update-meals-ingredients-summary',
  UPDATE_DAILY_INGREDIENTS_SUMMARY: 'update-daily-ingredients-summary',
}

const MEALS = ["Breakfast", "II Breakfast", "Lunch", "Snack", "Dinner"];

const DAILY_DEMAND = { KCAL: 2000, PROTEINS: 120, FATS: 55, CARBS: 240 };


// COMPONENTS

function App() {
  const reducer = (state, action) => {
    switch (action.type) {

      case ACTIONS.UPDATE_MEALS_INGREDIENTS_SUMMARY: {
        const newMealsIngredientsSummary = [...state.mealsIngredientsSummary];

        newMealsIngredientsSummary[action.payload.mealId] = { proteins: action.payload.data.proteins,
                                                              fats: action.payload.data.fats, 
                                                              carbs: action.payload.data.carbs, 
                                                              kcal: action.payload.data.kcal };
        console.log(newMealsIngredientsSummary);
        return {...state, mealsIngredientsSummary: newMealsIngredientsSummary};                                                                 
      }

      case ACTIONS.UPDATE_DAILY_INGREDIENTS_SUMMARY: {
        let dailyIngredientsSum = { proteinsSum: 0, fatsSum: 0, carbsSum: 0, kcalSum: 0 };
        let mealsIngredientsSum = { proteinsSum: 0, fatsSum: 0, carbsSum: 0, kcalSum: 0 };

        state.mealsIngredientsSummary.forEach(meal => {
          mealsIngredientsSum = { proteinsSum: meal.proteins,
                                  fatsSum:     meal.fats,
                                  carbsSum:    meal.carbs,
                                  kcalSum:     meal.kcal };

          dailyIngredientsSum = { proteinsSum: dailyIngredientsSum.proteinsSum + mealsIngredientsSum.proteinsSum,
                                  fatsSum:     dailyIngredientsSum.fatsSum     + mealsIngredientsSum.fatsSum,
                                  carbsSum:    dailyIngredientsSum.carbsSum    + mealsIngredientsSum.carbsSum,
                                  kcalSum:     dailyIngredientsSum.kcalSum     + mealsIngredientsSum.kcalSum };

          mealsIngredientsSum = { proteinsSum: 0,
                                  fatsSum: 0,
                                  carbsSum: 0,
                                  kcalSum: 0 };
        });
        console.log(dailyIngredientsSum);
        return {...state, dailyIngredientsSummary: dailyIngredientsSum };
      }

      default: return console.error(`Unknown action type: ${action.type}`);
    }

  }

  const initialState = {
    mealsIngredientsSummary: [],
    dailyIngredientsSummary: {}
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const countPercentOfEatenIngredient = (eatenAmount, maxAmount) => {
    return Math.round(eatenAmount / maxAmount * 100);
  }

  const countAmountOfIngredientLeft = (eatenAmount, maxAmount) => {
    if (eatenAmount >= maxAmount)
      return 0;
    else
      return maxAmount - eatenAmount;
  }

  const updateMealSummary = (object, mealId) => {
    dispatch({ type: ACTIONS.UPDATE_MEALS_INGREDIENTS_SUMMARY, payload: {data: object, mealId: mealId} });
    updateDailySummary();
  } 

  const updateDailySummary = () => {
    dispatch({ type: ACTIONS.UPDATE_DAILY_INGREDIENTS_SUMMARY });
  };

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
          <DateChanger />

        </section>

      
        <section className="center-section__meals">

        <Meal name="Breakfast" mealId={0} updateGauges={ updateMealSummary } />
        <Meal name="II Breakfast" mealId={1} updateGauges={ updateMealSummary } />
        <Meal name="Lunch" mealId={2} updateGauges={ updateMealSummary } />
        <Meal name="Snack" mealId={3} updateGauges={ updateMealSummary } />
        <Meal name="Dinner" mealId={4} updateGauges={ updateMealSummary } />

        </section>


      </main>


      <aside className="right-section">

        <Gauge 
          amount={ state.dailyIngredientsSummary.kcalSum }
          name="kcal"
          percent={ countPercentOfEatenIngredient(state.dailyIngredientsSummary.kcalSum, DAILY_DEMAND.KCAL) }
          left={ countAmountOfIngredientLeft(state.dailyIngredientsSummary.kcalSum, DAILY_DEMAND.KCAL) }
          isKcal={true} />

        <Gauge 
          amount={ state.dailyIngredientsSummary.proteinsSum }
          name="proteins" 
          percent={ countPercentOfEatenIngredient(state.dailyIngredientsSummary.proteinsSum, DAILY_DEMAND.PROTEINS) }
          left={ countAmountOfIngredientLeft(state.dailyIngredientsSummary.proteinsSum, DAILY_DEMAND.PROTEINS) } />
        
        <Gauge 
          amount={ state.dailyIngredientsSummary.fatsSum }
          name="fats" 
          percent={ countPercentOfEatenIngredient(state.dailyIngredientsSummary.fatsSum, DAILY_DEMAND.FATS) }
          left={ countAmountOfIngredientLeft(state.dailyIngredientsSummary.fatsSum, DAILY_DEMAND.FATS) } />
        
        <Gauge 
          amount={ state.dailyIngredientsSummary.carbsSum }   
          name="carbohydrates" 
          percent={ countPercentOfEatenIngredient(state.dailyIngredientsSummary.carbsSum, DAILY_DEMAND.CARBS) }
          left={ countAmountOfIngredientLeft(state.dailyIngredientsSummary.carbsSum, DAILY_DEMAND.CARBS) } />

      </aside>


    </div>
  )
}


// RENDERING

ReactDOM.render(<App />, document.querySelector("#root"));