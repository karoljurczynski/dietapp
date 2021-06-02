// IMPORTS

import { React, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaChevronCircleLeft } from 'react-icons/fa';
import AddingForm from './AddingForm';
import AddingList from './AddingList';


// COMPONENT

export default function AddWindow(props) {

  // HOOKS

  const [isAddingTypeSetAtLeftOption, setAddingType] = useState(true);

  // EFFECTS

  // BLURING AND DISABLING POINTER EVENTS ON BACKGROUND
  useEffect(() => {
    const rootElement = document.querySelector("#root");
    const wrapper = document.querySelector(".wrapper");
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

  // CLEARING FORM AFTER CHANGE OF SWITCH OPTION
  useEffect(() => {
    props.handleFormClearing();
  },[ isAddingTypeSetAtLeftOption ]);


  // FUNCTIONS

  const changeAddingType = () => {
    setAddingType(!isAddingTypeSetAtLeftOption);
  }
  

  // RETURN

  return ReactDOM.createPortal ( 
    <div className="window window--add">
      
      <header className="window__header">
        
        <h2 className="window__header__heading" >{ props.type === 'exercises' ? "Add serie" : "Add product" }</h2>
    
        <button className="window__header__back-button" onClick={ props.handleAddWindow }><FaChevronCircleLeft /></button>        
        <button className="window__header__switch" onClick={ changeAddingType }>
          <h3 
            className={ isAddingTypeSetAtLeftOption 
                        ? "window__header__switch__left window__header__switch__left--selected"
                        : "window__header__switch__left" }>
            { props.type === 'exercises' ? "Last training" : "From list" }
          </h3>
          <h3 
            className={ isAddingTypeSetAtLeftOption 
                        ? "window__header__switch__right"
                        : "window__header__switch__right window__header__switch__right--selected" }>
            { props.type === 'exercises' ? "Last serie" : "Your own" }
          </h3>
        </button>

      </header>

      { props.type === 'exercises'

        ? <main className="window__form">
          { isAddingTypeSetAtLeftOption

            ? <AddingForm 
                type="last-training"
                data={{ 
                  weight: props.data.weight,
                  reps: props.data.reps
                }}
                warning={ props.warning }
                handleOnChange={ props.handleOnChange }
                handleSerieAdding={ props.handleSerieAdding }
                handleFormClearing={ props.handleFormClearing }
                handleAddWindow={ props.handleAddWindow }
                lastTimeData={ props.lastTimeData }
              />

            : <AddingForm 
                type="last-serie"
                data={{ 
                  weight: props.data.weight,
                  reps: props.data.reps
                }}
                warning={ props.warning }
                handleOnChange={ props.handleOnChange }
                handleSerieAdding={ props.handleSerieAdding }
                handleFormClearing={ props.handleFormClearing }
                handleAddWindow={ props.handleAddWindow }
                lastTimeData={ props.lastTimeData }
              />
          }
        </main>

        : <main className="window__form">
          { isAddingTypeSetAtLeftOption

            ? <AddingList 
                warning={ props.warning }
                handleAddWindow={ props.handleAddWindow }
                handlePredefinedProductsAdding={ props.handlePredefinedProductsAdding }
              />
              
            : <AddingForm
                type="nutrition"
                data={{ 
                  isPlaceholderEnabled: props.data.isPlaceholderEnabled,
                  name: props.data.name, 
                  weight: props.data.weight,
                  proteins: props.data.proteins,
                  fats: props.data.fats,
                  carbs: props.data.carbs,
                  kcal: props.data.kcal }}
                warning={ props.warning }
                handleOnChange={ props.handleOnChange }
                handleFormClearing={ props.handleFormClearing }
                handleProductAdding={ props.handleProductAdding }
                handleAddWindow={ props.handleAddWindow }
              />
          }
        </main>
      
      }

    </div>,
    document.getElementById('portal')
  )
}