// IMPORTS

import { React, useState, useEffect } from 'react';
import { FaPlusCircle } from 'react-icons/fa';

import { db } from '../../index'; 
import { getDoc, setDoc, doc } from "firebase/firestore";


// VARIABLES

const initialOptionsStates = {
  'list-saving': false
};


// COMPONENT

export default function AddingForm(props) {

  // HOOKS
  
  const [optionsStates, setOptionsStates] = useState(initialOptionsStates);
  const [isFormCompleted, setIsFormCompleted] = useState(false);
  const [isStateEqualToProps, setIsStateEqualToProps] = useState(true);
  

  // EFFECTS

  // CHECKING IF FORM IS COMPLETED
  useEffect(() => { 
    checkIfFormCompleted();
    checkIfStateIsEqualToProps();
  }, [ props, optionsStates ]);

  
  // FUNCTIONS

  const updatePredefinedProductsInDatabase = async (newList) => {
    try {
      await setDoc(doc(db, "predefinedProducts", "predefinedProductsList"), {
        list: newList
      },
      { merge: true });
    }
    catch (e) {
      console.error(e);
    }
  }

  const getPredefinedProductsFromDatabase = async () => {
    let predefinedProductsList = [];
    try {
      const querySnapshot = await getDoc(doc(db, "predefinedProducts", "predefinedProductsList"));
      predefinedProductsList = querySnapshot.data().list;
      if (!predefinedProductsList)
        updatePredefinedProductsInDatabase([]);
    }    
    catch (e) {
      console.error(e);
    }
    return predefinedProductsList;
  }

  const handleClearButton = () => {
    setOptionsStates(initialOptionsStates);
    props.handleFormClearing();
    setIsStateEqualToProps(true);
  }

  const handleCancelButton = () => {
    props.handleAddWindow();
  }

  const checkIfStateIsEqualToProps = () => {
    // CHECKING OPTIONS
    Object.keys(optionsStates).forEach(option => {
      setIsStateEqualToProps(true);
      if (optionsStates[option] !== initialOptionsStates[option])
        setIsStateEqualToProps(false);
    });

    // CHECKING INPUTS
    Object.keys(props.data).forEach(key => {
      if (props.data[key])
        setIsStateEqualToProps(false);
    });
  }

  const checkIfFormCompleted = () => {
    if (props.type === 'nutrition') {
      const name = document.querySelector("#name").value;
      const weight = document.querySelector("#weight").value;
      const proteins = document.querySelector("#proteins").value;
      const fats = document.querySelector("#fats").value;
      const carbs = document.querySelector("#carbs").value;
      const kcal = document.querySelector("#kcal").value;

      if(name && weight && proteins && fats && carbs && kcal)
        setIsFormCompleted(true);
      else
        setIsFormCompleted(false);
    }

    else {
      const weight = document.querySelector("#weight").value;
      const reps = document.querySelector("#reps").value;

      if (weight && reps)
        setIsFormCompleted(true);
      else
        setIsFormCompleted(false);
    }
  }

  const searchForCheckedOptions = (keysArray) => {
    let checkedOptions = [];
    keysArray.forEach(key => {
      if (optionsStates[key])
        checkedOptions.push(key);
    });

    return checkedOptions;
  }

  const handleAddProduct = (e) => {
    props.handleProductAdding(e);
    
    const keys = Object.keys(optionsStates);

    const checkedOptions = searchForCheckedOptions(keys);

    checkedOptions.forEach(checkedKey => {

      switch(checkedKey) {
        case 'list-saving': {

          const newProduct = {
            id:       Date.now(), 
            name:     document.querySelector("#name").value, 
            weight:   Number(document.querySelector("#weight").value), 
            proteins: Number(document.querySelector("#proteins").value), 
            fats:     Number(document.querySelector("#fats").value),
            carbs:    Number(document.querySelector("#carbs").value),
            kcal:     Number(document.querySelector("#kcal").value),
          }

          saveNewProductToList(newProduct);
        }
      }
    });
  }

  const handleAddSerie = (e) => {
    props.handleSerieAdding(e);

  }

  const saveNewProductToList = async (newProduct) => {
    const newList =  await getPredefinedProductsFromDatabase();
    newList.push(newProduct);
    updatePredefinedProductsInDatabase(newList);
  }

  const handleCheckboxOnClick = (e) => {
    setOptionsStates(prevOptions => { return {...prevOptions, [e.target.id]: !optionsStates[e.target.id]} });
  }


  // RETURN

  return (
    <>
    { props.type !== 'nutrition' 
      ? <form className="window__main window__main--add" onSubmit={ handleAddSerie }>

          <section className="window__main__section window__main__section--form">

            <h3 className="window__main__section__title">Last time</h3>

            <div className="window__main__input-line">
              <label className="window__main__input-line__label" htmlFor="oldWeight">Weight: </label>
              <p 
                className="window__main__input-line__input window__main__input-line__input--unchanging" 
                id="oldWeight">
                { props.type === 'last-training' ? props.lastTimeData.training.weight : props.lastTimeData.serie.weight }
              </p>
              <span className="window__main__input-line__unit">kg</span>
            </div>

            <div className="window__main__input-line">
              <label className="window__main__input-line__label" htmlFor="oldReps">Reps: </label>
              <p 
                className="window__main__input-line__input window__main__input-line__input--unchanging" 
                id="oldReps">
                { props.type === 'last-training' ? props.lastTimeData.training.reps : props.lastTimeData.serie.reps }
              </p>
              <span className="window__main__input-line__unit">reps</span>
            </div>
          
          </section>

          <section className="window__main__section window__main__section--form">

            <h3 className="window__main__section__title">New serie</h3>

            <div className="window__main__input-line">
              <label className="window__main__input-line__label" htmlFor="weight">Weight: </label>
              <input
                className="window__main__input-line__input" 
                type="text" 
                id="weight"
                value={ props.data.weight } 
                onChange={ props.handleOnChange }
                placeholder={ props.warning[1] === 'weight' ? props.warning[0] : null }
                maxLength="3">
              </input>
              <span className="window__main__input-line__unit">kg</span>
            </div>

            <div className="window__main__input-line">
              <label className="window__main__input-line__label" htmlFor="reps">Reps: </label>
              <input 
                className="window__main__input-line__input" 
                type="text" 
                id="reps"
                value={ props.data.reps } 
                onChange={ props.handleOnChange }
                placeholder={ props.warning[1] === 'reps' ? props.warning[0] : null }
                maxLength="2">
              </input>
              <span className="window__main__input-line__unit">reps</span>
            </div>
            
          </section>

          <button 
                className={ isFormCompleted
                            ? "window__header__add-button"
                            : "window__header__add-button window__header__add-button--disabled" }
                type="submit"
                disabled={ isFormCompleted ? false : true }><FaPlusCircle /></button>

          <section className="window__bottom">

            <button 
              className={ isStateEqualToProps ? "window__bottom__tertiary-button window__bottom__tertiary-button--disabled" : "window__bottom__tertiary-button" } 
              disabled={ isStateEqualToProps ? true : false }
              type="button" 
              onClick={ handleClearButton }>
              Clear</button>

            <div>
              <button className="window__bottom__secondary-button" type="button" onClick={ handleCancelButton }>Cancel</button>
              <button 
                className={ isFormCompleted
                            ? "window__bottom__primary-button"
                            : "window__bottom__primary-button window__bottom__primary-button--disabled" }
                type="submit"
                disabled={ isFormCompleted ? false : true }>Add</button>
            </div>

          </section>

          <button 
            className={ isFormCompleted
                        ? "window__header__add-button"
                        : "window__header__add-button window__header__add-button--disabled" }
            type="submit"
            style={{ zIndex: 11 }}
            disabled={ isFormCompleted ? false : true }><FaPlusCircle />
          </button>

        </form>

      : <form className="window__main window__main--add" onSubmit={ handleAddProduct }>

          <section className="window__main__section window__main__section--form">

            <h3 className="window__main__section__title">Product info</h3>
            
            <div className="window__main__input-line">
              <label className="window__main__input-line__label" htmlFor="name">Product name: </label>
              <input
                className="window__main__input-line__input"
                type="text"
                id="name"
                value={ props.data.name }
                onChange={ props.handleOnChange }
                placeholder={ props.warning[1] === 'name' ? props.warning[0] : null }
                maxLength="32">
              </input>
            </div>

            <div className="window__main__input-line">
              <label className="window__main__input-line__label" htmlFor="weight">Product weight: </label>
              <input 
                className="window__main__input-line__input"
                type="text"
                id="weight"
                value={ props.data.weight } 
                onChange={ props.handleOnChange }
                placeholder={ props.warning[1] === 'weight' ? props.warning[0] : null }
                maxLength="4">
              </input>
              <span className="window__main__input-line__unit">g</span>
            </div>


          </section>

          <section className="window__main__section window__main__section--form">
            
            <h3 className="window__main__section__title">Nutrition facts</h3>
            
            <div className="window__main__input-line">
              <label className="window__main__input-line__label" htmlFor="proteins">Proteins: </label>
              <input 
                className="window__main__input-line__input" 
                type="text" 
                id="proteins"
                value={ props.data.proteins } 
                onChange={ props.handleOnChange }
                placeholder={ props.warning[1] === 'proteins' ? props.warning[0] : null }
                maxLength="4">
              </input>
              <span className="window__main__input-line__unit">g</span>
            </div>

            <div className="window__main__input-line">
              <label className="window__main__input-line__label" htmlFor="fats">Fats: </label>
              <input
                className="window__main__input-line__input"  
                type="text" 
                id="fats"
                value={ props.data.fats } 
                onChange={ props.handleOnChange }
                placeholder={ props.warning[1] === 'fats' ? props.warning[0] : null }
                maxLength="4">
              </input>
              <span className="window__main__input-line__unit">g</span>
            </div>

            <div className="window__main__input-line">
              <label className="window__main__input-line__label" htmlFor="carbs">Carbs: </label>
              <input
                className="window__main__input-line__input"  
                type="text" 
                id="carbs"
                value={ props.data.carbs } 
                onChange={ props.handleOnChange }
                placeholder={ props.warning[1] === 'carbs' ? props.warning[0] : null }
                maxLength="4">
              </input>
              <span className="window__main__input-line__unit">g</span>
            </div>

            <div className="window__main__input-line">
              <label className="window__main__input-line__label" htmlFor="kcal">Calories: </label>
              <input
                className="window__main__input-line__input"  
                type="text" 
                id="kcal"
                value={ props.data.kcal }
                onChange={ props.handleOnChange }
                placeholder={ props.warning[1] === 'kcal' ? props.warning[0] : null }
                maxLength="4">
              </input>
              <span className="window__main__input-line__unit">kcal</span>
            </div>


          </section>

          <section className="window__main__section window__main__section--form">

            <h3 className="window__main__section__title">Options</h3>

            <div className="window__main__input-line">
              <label className="window__main__input-line__label window__main__input-line__label--checkbox" htmlFor="list-saving">Save to list</label>
              <button 
                className="window__main__input-line__checkbox"
                id="list-saving"
                type="button"
                onClick={ handleCheckboxOnClick }>
                <div 
                  className="window__main__input-line__checkbox__background" 
                  id="list-saving"
                  style={ optionsStates['list-saving'] ? {backgroundColor: "#7500AF"} : {backgroundColor: "transparent"} }>
                </div>
              </button>
            </div>

          </section>

          <button 
            className={ isFormCompleted
                        ? "window__header__add-button"
                        : "window__header__add-button window__header__add-button--disabled" }
            type="submit"
            style={{ zIndex: 11 }}
            disabled={ isFormCompleted ? false : true }><FaPlusCircle />
          </button>

          <section className="window__bottom">

            <button 
              className={ isStateEqualToProps ? "window__bottom__tertiary-button window__bottom__tertiary-button--disabled" : "window__bottom__tertiary-button" } 
              disabled={ isStateEqualToProps ? true : false }
              type="button" 
              onClick={ handleClearButton }>
              Clear</button>

            <div>
              <button className="window__bottom__secondary-button" type="button" onClick={ handleCancelButton }>Cancel</button>
              <button 
                className={ isFormCompleted
                            ? "window__bottom__primary-button"
                            : "window__bottom__primary-button window__bottom__primary-button--disabled" }
                type="submit"
                disabled={ isFormCompleted ? false : true }>Add</button>
            </div>

          </section>

        </form>
    }
    </>
  )
}