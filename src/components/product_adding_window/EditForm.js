// IMPORTS

import { React, useReducer, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { warnings } from '../meal/Meal';
import { FaChevronCircleLeft, FaSave } from 'react-icons/fa';


// COMPONENT

export default function EditForm(props) {

  // VARIABLES

  const ACTIONS = {
    UPDATE_PRODUCT_DATA: 'update-product-data',
    RESET_FORM: 'reset-form',
    SET_WARNING: 'set-warning',
    CLEAR_WARNING: 'clear-warning'
  }

  const initialState = {
    productData: {
      id: props.data.id,
      name: props.data.name,
      weight: props.data.weight,
      proteins: props.data.proteins,
      fats: props.data.fats,
      carbs: props.data.carbs,
      kcal: props.data.kcal
    },
    warning: ['' ,'']
  }


  // HOOKS

  const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.UPDATE_PRODUCT_DATA: {
        switch (action.payload.key) {
          case 'name':     { return { ...state, productData: {...state.productData, name:     action.payload.value } }};
          case 'weight':   { return { ...state, productData: {...state.productData, weight:   action.payload.value } }};
          case 'proteins': { return { ...state, productData: {...state.productData, proteins: action.payload.value } }};
          case 'fats':     { return { ...state, productData: {...state.productData, fats:     action.payload.value } }};
          case 'carbs':    { return { ...state, productData: {...state.productData, carbs:    action.payload.value } }};
          case 'kcal':     { return { ...state, productData: {...state.productData, kcal:     action.payload.value } }};
          default:         { return console.error(`Unknown action type: ${action.type}`) };
        }
      }

      case ACTIONS.RESET_FORM: {
        return {...state, productData: 
          { id: props.data.id,
            name: props.data.name,
            weight: props.data.weight,
            proteins: props.data.proteins,
            fats: props.data.fats,
            carbs: props.data.carbs,
            kcal: props.data.kcal 
        }};
      }

      case ACTIONS.SET_WARNING: {
        if (action.payload === 'name')
          return { ...state, warning: [warnings.name, action.payload] }
        else 
          return { ...state, warning: [warnings.weight, action.payload] }
      }

      case ACTIONS.CLEAR_WARNING: {
        return { ...state, warning: ['', action.payload] }
      }
      
      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isFormCompleted, setIsFormCompleted] = useState(false);
  const [isStateEqualToProps, setIsStateEqualToProps] = useState(true);

  
  // EFFECTS

  // BLURING AND DISABLING WINDOW AFTER CONFIRM WINDOW MOUNTING
  useEffect(() => {
    const addingWindow = document.querySelector(".window--add");
    addingWindow.style.filter = "blur(5px) opacity(40%) grayscale(100%)";
    addingWindow.style.pointerEvents = "none";

    return () => {
      addingWindow.style.filter = "blur(0px) opacity(100%) grayscale(0%)";
      addingWindow.style.pointerEvents = "auto";
    }

  }, []);

  // CHECKING IF FORM IS COMPLETED
  useEffect(() => { 
    checkIfFormCompleted();
    checkIfStateIsEqualToProps();
    
  }, [ state.productData ])


  // FUNCTIONS

  const checkIfFormCompleted = () => {
    const name = document.querySelector("#name").value;
    const weight = document.querySelector("#weight").value;

    if(name && weight)
      setIsFormCompleted(true);
    else
      setIsFormCompleted(false);
  }

  const handleResetingForm = (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.RESET_FORM });
    dispatch({ type: ACTIONS.CLEAR_WARNING });
    setIsStateEqualToProps(true);
  }

  const checkIfStateIsEqualToProps = () => {
    Object.keys(props.data).forEach(key => {
      if (props.data[key] !== state.productData[key])
        setIsStateEqualToProps(false); 
      });
  }

  const handleCancelButton = () => {
    const idOfSelectedProduct = props.data.id;

    // IF USER CANCEL EDITING, PRODUCT HAS TO BE UNSELECTED
    props.handleEditingWindow(idOfSelectedProduct);
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

    const setValueAsNull = () => {
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'weight', value: '' }});
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'proteins', value: 0 }});
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'fats', value: 0 }});
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'carbs', value: 0 }});
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'kcal', value: 0 }});
      dispatch({ type: ACTIONS.SET_WARNING, payload: 'weight' });
    }

    const setValueAsCorrect = () => {
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'weight', value: Number(e.target.value) } });
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'proteins', value: Math.round( e.target.value * nutritionPerOneGram.proteins) } });
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'fats', value: Math.round( e.target.value * nutritionPerOneGram.fats) } });
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'carbs', value: Math.round( e.target.value * nutritionPerOneGram.carbs) } });
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'kcal', value: Math.round( e.target.value * nutritionPerOneGram.kcal) } });
      dispatch({ type: ACTIONS.CLEAR_WARNING, payload: 'weight' });
    }

    if (isNumber.test(e.target.value[e.target.value.length - 1])) {
      isZero.test(e.target.value)
      ? setValueAsNull()
      : setValueAsCorrect();
    }

    else {
      setValueAsNull();
    }
  }

  const handleNameChanging = (e) => {
    const isWord = /[a-z\s]/i;
    e.preventDefault();
    if (isWord.test(e.target.value[e.target.value.length - 1])) {
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'name', value: e.target.value }})
      dispatch({ type: ACTIONS.CLEAR_WARNING, payload: 'name'});
    }
    else {
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'name', value: "" }});
      dispatch({ type: ACTIONS.SET_WARNING, payload: 'name'});
    }
  }

  const handleSavingChanges = (e) => {
    e.preventDefault();
    props.handleProductEditing(state.productData);
  }


  // RETURN

  return ReactDOM.createPortal (
    <form className="window window--edit" onSubmit={ handleSavingChanges }>

      <header className="window__header">
        <h3 className="window__header__heading">Edit product</h3>
        <button className="window__header__back-button" onClick={ handleCancelButton }><FaChevronCircleLeft /></button>
        <button 
          className={ 
            isFormCompleted
            ? "window__header__add-button"
            : "window__header__add-button window__header__add-button--disabled" } 
          disabled={ isFormCompleted ? false : true } 
          onClick={ handleSavingChanges }><FaSave /></button>
      </header>

      <main className="window__form">

        <section className="window__main__section window__main__section--form">
          
          <h3 className="window__main__section__title">Product info</h3>

          <div className="window__main__input-line">
            <label className="window__main__input-line__label" htmlFor="name">Product name: </label>
            <input
                className="window__main__input-line__input" 
                type="text"
                id="name"
                value={ state.productData.name } 
                onChange={ handleNameChanging }
                placeholder={ state.warning[1] === 'name' ? state.warning[0] : null }
                maxLength="32">
            </input>
          </div>

          <div className="window__main__input-line">
            <label className="window__main__input-line__label" htmlFor="weight">Product weight: </label>
            <input
                className="window__main__input-line__input" 
                type="text"
                id="weight"
                value={ state.productData.weight } 
                onChange={ calculateNutritionFacts }
                placeholder={ state.warning[1] === 'weight' ? state.warning[0] : null }
                maxLength="32">
            </input>
            <span className="window__main__input-line__unit">g</span>
          </div>
        
        </section>
        
        <section className="window__main__section window__main__section--form">
          
          <h3 className="window__main__section__title">Nutrition facts</h3>

          <div className="window__main__input-line">
            <label className="window__main__input-line__label" htmlFor="proteins">Proteins: </label>
            <p
              className="window__main__input-line__input window__main__input-line__input--unchanging" 
              id="proteins">
              { state.productData.proteins }
            </p>
            <span className="window__main__input-line__unit">g</span>
          </div>

          <div className="window__main__input-line">
            <label className="window__main__input-line__label" htmlFor="fats">Fats: </label>
            <p
              className="window__main__input-line__input window__main__input-line__input--unchanging" 
              id="fats">
              { state.productData.fats }
            </p>
            <span className="window__main__input-line__unit">g</span>
          </div>

          <div className="window__main__input-line">
            <label className="window__main__input-line__label" htmlFor="carbs">Carbs: </label>
            <p
              className="window__main__input-line__input window__main__input-line__input--unchanging" 
              id="carbs">
              { state.productData.carbs }
            </p>
            <span className="window__main__input-line__unit">g</span>
          </div>

          <div className="window__main__input-line">
            <label className="window__main__input-line__label" htmlFor="kcal">Calories: </label>
            <p
              className="window__main__input-line__input window__main__input-line__input--unchanging" 
              id="kcal">
              { state.productData.kcal }
            </p>
            <span className="window__main__input-line__unit">kcal</span>
          </div>
        
        </section>
        
      </main>

      <section className="window__bottom">
        <button 
          className={ isStateEqualToProps ? "window__bottom__tertiary-button window__bottom__tertiary-button--disabled" : "window__bottom__tertiary-button" } 
          disabled={ isStateEqualToProps ? true : false } 
          type="button" 
          onClick={ handleResetingForm }>
          Reset</button>
        
        <div>
          <button className="window__bottom__secondary-button" type="button" onClick={ handleCancelButton }>Cancel</button>
          <button 
            className={ isFormCompleted
                        ? "window__bottom__primary-button"
                        : "window__bottom__primary-button window__bottom__primary-button--disabled"
                        } 
            type="submit"
            disabled={ isFormCompleted ? false : true }>
            Save</button>
        </div>

      </section>

    </form>,
    document.getElementById("portal")
  )
}