import { useReducer } from 'react';
import { useEffect } from 'react';
import { React, useState } from 'react';
import './styles/productAddingWindow.css';

const ACTIONS = {
  UPDATE_PRODUCT_DATA: 'update-product-data',
  RESET_FORM: 'reset-form'
}

export default function EditForm(props) {
  const initialProductData = {
    id: props.data.id,
    name: props.data.name,
    weight: props.data.weight,
    proteins: props.data.proteins,
    fats: props.data.fats,
    carbs: props.data.carbs,
    kcal: props.data.kcal
  }

  const reducer = (state, action) => {
    switch (action.type) {

      case ACTIONS.UPDATE_PRODUCT_DATA: {
        switch (action.payload.key) {
          case 'name':     { return { ...state, name: action.payload.value } };
          case 'weight':   { return { ...state, weight: action.payload.value } };
          case 'proteins': { return { ...state, proteins: action.payload.value } };
          case 'fats':     { return { ...state, fats: action.payload.value } };
          case 'carbs':    { return { ...state, carbs: action.payload.value } };
          case 'kcal':     { return { ...state, kcal: action.payload.value } };
          default:         { return console.error(`Unknown action type: ${action.type}`) };
        }
      }

      case ACTIONS.RESET_FORM: {
        return { id: props.data.id,
                 name: props.data.name,
                 weight: props.data.weight,
                 proteins: props.data.proteins,
                 fats: props.data.fats,
                 carbs: props.data.carbs,
                 kcal: props.data.kcal };
      }

      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }

  const [state, dispatch] = useReducer(reducer, initialProductData);

  const handleResetingForm = (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.RESET_FORM });
  }

  const calculateNutritionFacts = (e) => {
    const isNumber = /[0-9]/;
    const isZero = /^[0]{1}/;

    const nutritionPerOneGram = {
      proteins: Number(props.data.proteins) / Number(props.data.weight),
      fats: Number(props.data.fats) / Number(props.data.weight),
      carbs: Number(props.data.carbs) / Number(props.data.weight),
      kcal: Number(props.data.kcal) / Number(props.data.weight)
    };

    if (isNumber.test(e.target.value[e.target.value.length - 1])) {
      if (isZero.test(e.target.value)) {
        dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'weight', value: 1 }});
        dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'proteins', value: Math.round( 1 * nutritionPerOneGram.proteins) } });
        dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'fats', value: Math.round( 1 * nutritionPerOneGram.fats) } });
        dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'carbs', value: Math.round( 1 * nutritionPerOneGram.carbs) } });
        dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'kcal', value: Math.round( 1 * nutritionPerOneGram.kcal) } });

      }

      else {
        dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'weight', value: Number(e.target.value) } });
        dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'proteins', value: Math.round( e.target.value * nutritionPerOneGram.proteins) } });
        dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'fats', value: Math.round( e.target.value * nutritionPerOneGram.fats) } });
        dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'carbs', value: Math.round( e.target.value * nutritionPerOneGram.carbs) } });
        dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'kcal', value: Math.round( e.target.value * nutritionPerOneGram.kcal) } });
      }
    }

    else
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'weight', value: "" }});
  }

  const handleNameChanging = (e) => {
    const isWord = /[a-z\s]/i;
    e.preventDefault();
    isWord.test(e.target.value[e.target.value.length - 1])
    ? dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'name', value: e.target.value }})
    : dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'name', value: "" }});
  }

  const handleSavingChanges = (e) => {
    e.preventDefault();
    props.handleProductEditing(state);
  }

  return (
    <section className="adding-window__edit">

      <h1 className="adding-window__title adding-window__title--edit">Edit product</h1>

      <main className="adding-window__main">

        <form className="adding-window__main__adding-form adding-window__main__adding-form--edit"  onSubmit={ handleSavingChanges }>

          <section className="adding-window__main__adding-form__product-info">


            <h3 className="adding-window__main__adding-form__product-info__title">Product info</h3>
            
            <div className="adding-window__main__adding-form__product-info__line">
              <label className="adding-window__main__adding-form__product-info__line__label" htmlFor="name">Product name: </label>
              <input
                className="adding-window__main__adding-form__product-info__line__input" 
                type="text"
                id="name"
                value={ state.name } 
                onChange={ handleNameChanging }
                placeholder="Product name"
                maxLength="32"
                required>
              </input>
              <p className="adding-window__main__adding-form__product-info__line__warning">You are idiot</p>
            </div>

            <div className="adding-window__main__adding-form__product-info__line">
              <label className="adding-window__main__adding-form__product-info__line__label" htmlFor="weight">Product weight: </label>
              <input 
                className="adding-window__main__adding-form__product-info__line__input" 
                type="text" 
                id="weight"
                value={ state.weight } 
                onChange={ calculateNutritionFacts }
                placeholder="Weight"
                maxLength="4"
                required>
              </input>
              <span className="adding-window__main__adding-form__product-info__line__decoration">g</span>
              <p className="adding-window__main__adding-form__product-info__line__warning">You are idiot</p>
            </div>


          </section>

          <section className="adding-window__main__adding-form__nutrition-facts">
            

            <h3 className="adding-window__main__adding-form__nutrition-facts__title">Nutrition facts</h3>
            
            <div className="adding-window__main__adding-form__nutrition-facts__line">
              <label className="adding-window__main__adding-form__nutrition-facts__line__label" htmlFor="proteins">Proteins: </label>
              <p 
                className="adding-window__main__adding-form__nutrition-facts__line__input" 
                id="proteins">
                { state.proteins }
              </p>
              <span className="adding-window__main__adding-form__nutrition-facts__line__decoration">g</span>
            </div>

            <div className="adding-window__main__adding-form__nutrition-facts__line">
              <label className="adding-window__main__adding-form__nutrition-facts__line__label" htmlFor="fats">Fats: </label>
              <p 
                className="adding-window__main__adding-form__nutrition-facts__line__input" 
                id="fats">
                { state.fats }
              </p>
              <span className="adding-window__main__adding-form__nutrition-facts__line__decoration">g</span>
            </div>

            <div className="adding-window__main__adding-form__nutrition-facts__line">
              <label className="adding-window__main__adding-form__nutrition-facts__line__label" htmlFor="carbs">Carbs: </label>
              <p 
                className="adding-window__main__adding-form__nutrition-facts__line__input" 
                id="carbs">
                { state.carbs }
              </p>
              <span className="adding-window__main__adding-form__nutrition-facts__line__decoration">g</span>
            </div>

            <div className="adding-window__main__adding-form__nutrition-facts__line">
              <label className="adding-window__main__adding-form__nutrition-facts__line__label" htmlFor="kcal">Calories: </label>
              <p 
                className="adding-window__main__adding-form__nutrition-facts__line__input" 
                id="kcal">
                { state.kcal }
              </p>
              <span className="adding-window__main__adding-form__nutrition-facts__line__decoration">kcal</span>
            </div>


          </section>

          <section className="adding-window__main__adding-form__buttons-section">


            <button className="adding-window__main__adding-form__buttons-section__tertiary" onClick={ handleResetingForm }>Reset</button>
            
            <div className="adding-window__main__adding-form__buttons-section__right">
              <button className="adding-window__main__adding-form__buttons-section__secondary" onClick={ props.handleEditingWindow }>Cancel</button>
              <input className="adding-window__main__adding-form__buttons-section__primary" type="submit" value="Save"></input>
            </div>


          </section>

          </form>

      </main>

    </section>
  )
}