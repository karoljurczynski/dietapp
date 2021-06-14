// IMPORTS

import { React, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/window/window.css';
import { FaChevronCircleLeft, FaTrashAlt } from 'react-icons/fa';


// COMPONENTS

export default function RemoveWindow(props) {

  // HOOKS

  const [isRemovingAllButtonPressed, setRemovingAllButtonPressed] = useState(false);
  const [isRemoveButtonDisabled, setIsRemoveButtonDisabled] = useState(false);


  // EFFECTS

  // BLURING AND DISABLING POINTER EVENTS ON WINDOW AFTER CONFIRM WINDOW MOUNTING
  useEffect(() => {
    const removingWindow = document.querySelector(".window");

    if (isRemovingAllButtonPressed) {
      removingWindow.style.filter = "blur(5px) opacity(40%) grayscale(100%)";
      removingWindow.style.pointerEvents = "none";
    }
    else {
      removingWindow.style.filter = "blur(0px) opacity(100%) grayscale(0%)";
      removingWindow.style.pointerEvents = "auto";
    }

  }, [ isRemovingAllButtonPressed ]);

  // BLURING AND DISABLING POINTER EVENTS ON BACKGROUND AFTER MOUNTING
  useEffect(() => {
    const wrapper = document.querySelector(".wrapper");
    const rootElement = document.querySelector("#root");
    const hamburger = document.querySelector(".left-section__hamburger");
    const accountIcon = document.querySelector(".left-section__account");
    wrapper.style.filter = "blur(5px) opacity(40%) grayscale(100%)";
    wrapper.style.pointerEvents = "none";
    rootElement.style.zIndex = 97;
    hamburger.style.display = "none";
    accountIcon.style.display = "none";
    
    return (() => {
      wrapper.style.filter = "blur(0px) opacity(100%) grayscale(0%)";
      wrapper.style.pointerEvents = "auto";
      rootElement.style.zIndex = 99;
      
      if (window.innerWidth < 769)
        hamburger.style.display = "flex";
        accountIcon.style.display = "flex";
    })

  }, []);

  // DISABLING REMOVE BUTTON AFTER MOUNTING
  useEffect(() => { 
    handleRemoveButtonDisabling() 
  }, []);


  // FUNCTIONS

  const handleSelected = (e) => {
    const item = document.getElementById(e.currentTarget.id);
    
    if(e.currentTarget.id) {
      const itemName = item.querySelector(".window__main__section__large-list__item__name");

      // "UNSELECTING"
      if (itemName.style.fontWeight === "bold") {
        item.style.background = "#ffffff";
        itemName.style.fontWeight = "normal";
      }

      // "SELECTING"
      else {
        item.style.background = "#7500AF30";
        itemName.style.fontWeight = "bold";
      }

      handleRemoveButtonDisabling();
    }
  }

  const handleRemoveButton = () => {
    const selectedIds = [];
    const items = document.querySelectorAll(".window__main__section__large-list__item");

    items.forEach(item => {
      const name = item.querySelector(".window__main__section__large-list__item__name")
      if(name.style.fontWeight === "bold")
        selectedIds.push(Number(item.id));
    });

    if (selectedIds.length !== 0)
      props.handleRemoving(selectedIds);
  }

  const handleRemoveButtonDisabling = () => {
    const items = document.querySelectorAll(".window__main__section__large-list__item");
    let returnedBoolean = false;
   
    for (let i = 0; i < items.length; i++) {
      const name = items[i].querySelector(".window__main__section__large-list__item__name");
      if (name.style.fontWeight === "bold") {
        returnedBoolean = false;
        break;
      }
      
      else
        returnedBoolean = true;
    }
    setIsRemoveButtonDisabled(returnedBoolean);
  }

  const handleRemovingAllButton = () => {
    setRemovingAllButtonPressed(true);
  }

  const handleRemovingAllCancel = () => {
    setRemovingAllButtonPressed(false);
  }

  const handleRemovingAllConfirm = () => {
    const selectedIds = [];
    const items = document.querySelectorAll(".window__main__section__large-list__item");

    items.forEach(item => {
      selectedIds.push(Number(item.id))
    });

    props.handleRemoving(selectedIds);
  }
  

  // RETURN

  return ReactDOM.createPortal (
    <>
    <div className="window__closer" onClick={ props.handleRemoveWindow }></div> 
    <section className="window">

      <header className="window__header">
        <h1 className="window__header__heading">{ props.type === 'exercises' ? "Remove serie" : "Remove product" }</h1>
        <button className="window__header__back-button" onClick={ props.handleRemoveWindow }><FaChevronCircleLeft /></button>
        <button 
          className={ 
            isRemoveButtonDisabled
            ? "window__header__add-button window__header__add-button--disabled" 
            : "window__header__add-button" }
          onClick={ handleRemoveButton }><FaTrashAlt /></button>

      </header>

      <main className="window__main window__main--list">

        <ul className="window__main__section__large-list window__main__section__large-list--heading">
          <li className="window__main__section__large-list__item window__main__section__large-list__item--heading">
              { props.type === 'exercises'
                ? <div className="window__main__section__large-list__wrapper">
                    <span className="window__main__section__large-list__item__name" style={{color: "white"}}>Serie</span>
                    <span className="window__main__section__large-list__item__nutrition-facts">
                      <p className="window__main__section__large-list__item__nutrition-facts__weight">Weight</p>
                    </span>
                    <span className="window__main__section__large-list__item__calories">Repetitions</span>
                  </div>

                : <div className="window__main__section__large-list__wrapper">
                    <span className="window__main__section__large-list__item__name" style={{color: "white"}}>Product name</span>
                    <span className="window__main__section__large-list__item__nutrition-facts">
                      <p className="window__main__section__large-list__item__nutrition-facts__proteins" title="Proteins">P</p>
                      <p className="window__main__section__large-list__item__nutrition-facts__fats" title="Fats">F</p>
                      <p className="window__main__section__large-list__item__nutrition-facts__carbs" title="Carbohydrates">C</p>
                    </span>
                    <span className="window__main__section__large-list__item__calories">Calories</span>
                  </div> 
              }
          </li>
        </ul>

        <ul className="window__main__section__large-list">

          { props.list.map(item => {
            return (
              props.type === 'exercises'

              ? <li onClick={ handleSelected } id={ item.id } key={ item.id } className="window__main__section__large-list__item">
                  <div className="window__main__section__large-list__wrapper">
                    <span id={ item.id } className="window__main__section__large-list__item__name">Serie { item.serieCount }</span>
                    <span id={ item.id } className="window__main__section__large-list__item__nutrition-facts">
                      <p id={ item.id } className="window__main__section__large-list__item__nutrition-facts__weight" title="Weight">{ item.weight } kg</p>
                    </span>
                    <span id={ item.id } className="window__main__section__large-list__item__calories">{ item.reps } reps</span>
                  </div>
                </li>

              : <li onClick={ handleSelected } id={ item.id } key={ item.id } className="window__main__section__large-list__item">
                  <div className="window__main__section__large-list__wrapper">
                    <span id={ item.id } className="window__main__section__large-list__item__name">{ item.name }</span>
                    <span id={ item.id } className="window__main__section__large-list__item__nutrition-facts">
                      <p id={ item.id } className="window__main__section__large-list__item__nutrition-facts__proteins" title="Proteins">{ item.proteins } g</p>
                      <p id={ item.id } className="window__main__section__large-list__item__nutrition-facts__fats" title="Fats">{ item.fats } g</p>
                      <p id={ item.id } className="window__main__section__large-list__item__nutrition-facts__carbs" title="Carbohydrates">{ item.carbs } g</p>
                    </span>
                    <span id={ item.id } className="window__main__section__large-list__item__calories">{ item.kcal } kcal</span>
                  </div>
                  <span id={ item.id } className="window__main__section__large-list__item__weight">{ item.weight } g</span>
                </li>
            )})
          }

        </ul>

      </main>

      <section className="window__bottom">
          <button className="window__bottom__tertiary-button" onClick={ handleRemovingAllButton }>Remove all</button>
          <div>
            <button className="window__bottom__secondary-button" onClick={ props.handleRemoveWindow }>Cancel</button>
            <button 
            className={ isRemoveButtonDisabled
                        ? "window__bottom__primary-button window__bottom__primary-button--disabled" 
                        : "window__bottom__primary-button" }
              onClick={ handleRemoveButton }>Remove</button>
          </div>
        </section>

    </section>

    { isRemovingAllButtonPressed 
        ? <section className="window window--login">

            <header className="window__header">
              <h2 className="window__header__heading">Remove all?</h2> 
            </header>

            <main className="window__main">
              <h3 className="window__main__message">{props.type === 'exercises' ? "Are you sure you want to remove all series in current exercise?" : "Are you sure you want to remove all products in current meal?"}</h3>
            </main>

            <section className="window__bottom">
              <button className="window__bottom__secondary-button" onClick={ handleRemovingAllCancel }>Cancel</button>
              <button className="window__bottom__primary-button" onClick={ handleRemovingAllConfirm }>Remove</button>
            </section>
          </section>
        : null }
    </>,
    document.getElementById("portal")
  )
}