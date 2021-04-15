import { React, useState, useEffect } from 'react';
import './styles/productRemovingWindow.css';
 
export default function RemoveWindow(props) {
  const [isRemovingAllButtonPressed, setRemovingAllButtonPressed] = useState(false);
  const [isRemoveButtonDisabled, setIsRemoveButtonDisabled] = useState(false);

  useEffect(() => {
    const removingWindow = document.querySelector(".removing-window");

    if (isRemovingAllButtonPressed) {
      removingWindow.style.filter = "blur(4px)";
      removingWindow.style.pointerEvents = "none";
    }
    else {
      removingWindow.style.filter = "none";
      removingWindow.style.pointerEvents = "auto";
    }
  }, [isRemovingAllButtonPressed]);


  // ENABLE POINTER EVENTS IN WINDOW AFTER MOUNTING
  useEffect(() => { 
    const removingWindow = document.querySelector(".removing-window");
    removingWindow.style.pointerEvents = "auto";

   }, []);

  // ENABLE POINTER EVENTS IN CONFIRM WINDOW AFTER MOUNTING 
  useEffect(() => {
    if (isRemovingAllButtonPressed) {
      const confirmWindow = document.querySelector(".removing-window__confirm");
      confirmWindow.style.pointerEvents = "auto";
    }

  },[isRemovingAllButtonPressed]);

  useEffect(() => { handleRemoveButtonDisabling() }, [])

  const handleSelected = (e) => {
    const item = document.getElementById(e.currentTarget.id);
    
    if(e.currentTarget.id) {
      const itemName = item.querySelector(".removing-window__main__list__item__name");

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
    const items = document.querySelectorAll(".removing-window__main__list__item");

    items.forEach(item => {
      const name = item.querySelector(".removing-window__main__list__item__name")
      if(name.style.fontWeight === "bold")
        selectedIds.push(Number(item.id));
    });

    if (selectedIds.length !== 0)
      props.handleRemoving(selectedIds);
  }

  const handleRemoveButtonDisabling = () => {
    const items = document.querySelectorAll(".removing-window__main__list__item");
    let returnedBoolean = false;
   
    for (let i = 0; i < items.length; i++) {
      const name = items[i].querySelector(".removing-window__main__list__item__name");
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
    const items = document.querySelectorAll(".removing-window__main__list__item");

    items.forEach(item => {
      selectedIds.push(Number(item.id))
    });

    props.handleRemoving(selectedIds);
  }
  
  return (
    <>
      <section className="removing-window">

        <h1 className="removing-window__title">{ props.type === 'exercises' ? "Remove serie" : "Remove product" }</h1>

        <main className="removing-window__main">

          <ul className="removing-window__main__list removing-window__main__list--heading">
            <li className="removing-window__main__list__item removing-window__main__list__item--heading">
                { props.type === 'exercises'
                  ? <div className="removing-window__main__list__wrapper">
                      <span className="removing-window__main__list__item__name removing-window__main__list__item__name--exercises" style={{color: "white"}}>Serie</span>
                      <span className="removing-window__main__list__item__nutrition-facts">
                        <p className="removing-window__main__list__item__nutrition-facts__proteins">Weight</p>
                      </span>
                      <span className="removing-window__main__list__item__calories">Repetitions</span>
                    </div>

                  : <div className="removing-window__main__list__wrapper">
                      <span className="removing-window__main__list__item__name" style={{color: "white"}}>Product name</span>
                      <span className="removing-window__main__list__item__nutrition-facts">
                        <p className="removing-window__main__list__item__nutrition-facts__proteins" title="Proteins">P</p>
                        <p className="removing-window__main__list__item__nutrition-facts__fats" title="Fats">F</p>
                        <p className="removing-window__main__list__item__nutrition-facts__carbs" title="Carbohydrates">C</p>
                      </span>
                      <span className="removing-window__main__list__item__calories">Calories</span>
                    </div> 
                }
            </li>
          </ul>

          <ul className="removing-window__main__list">

            { props.list.map(item => {
              return (
                props.type === 'exercises'

                ? <li onClick={ handleSelected } id={ item.id } key={ item.id } className="removing-window__main__list__item">
                    <div className="removing-window__main__list__wrapper">
                      <span id={ item.id } className="removing-window__main__list__item__name removing-window__main__list__item__name--exercises">Serie { item.serieCount }</span>
                      <span id={ item.id } className="removing-window__main__list__item__nutrition-facts">
                        <p id={ item.id } className="removing-window__main__list__item__nutrition-facts__proteins" title="Proteins">{ item.weight } kg</p>
                      </span>
                      <span id={ item.id } className="removing-window__main__list__item__calories">{ item.reps } reps</span>
                    </div>
                  </li>

                : <li onClick={ handleSelected } id={ item.id } key={ item.id } className="removing-window__main__list__item">
                    <div className="removing-window__main__list__wrapper">
                      <span id={ item.id } className="removing-window__main__list__item__name">{ item.name }</span>
                      <span id={ item.id } className="removing-window__main__list__item__nutrition-facts">
                        <p id={ item.id } className="removing-window__main__list__item__nutrition-facts__proteins" title="Proteins">{ item.proteins } g</p>
                        <p id={ item.id } className="removing-window__main__list__item__nutrition-facts__fats" title="Fats">{ item.fats } g</p>
                        <p id={ item.id } className="removing-window__main__list__item__nutrition-facts__carbs" title="Carbohydrates">{ item.carbs } g</p>
                      </span>
                      <span id={ item.id } className="removing-window__main__list__item__calories">{ item.kcal } kcal</span>
                    </div>
                    <span id={ item.id } className="removing-window__main__list__item__weight">{ item.weight } g</span>
                  </li>
              )})
            }

          </ul>
          
          <section className="removing-window__main__list__buttons-section">
            <button className="removing-window__main__list__buttons-section__tertiary" onClick={ handleRemovingAllButton }>Remove all</button>
            <div>
              <button className="removing-window__main__list__buttons-section__secondary" onClick={ props.handleRemoveWindow }>Cancel</button>
              <button 
              className={ isRemoveButtonDisabled
                          ? "removing-window__main__list__buttons-section__primary removing-window__main__list__buttons-section__primary--disabled" 
                          : "removing-window__main__list__buttons-section__primary" }
               onClick={ handleRemoveButton }>Remove</button>
            </div>
          </section>

        </main>

      </section>

      { isRemovingAllButtonPressed 
        ? <section className="removing-window__confirm">

            <h1 className="removing-window__title">Remove all?</h1> 

            <h3 className="removing-window__confirm__subtitle">{props.type === 'exercises' ? "Are you sure you want to remove all series in current exercise?" : "Are you sure you want to remove all products in current meal?"}</h3>

            <section className="removing-window__main__list__buttons-section" style={{ justifyContent: "flex-end" }}>
              <div>
                <button className="removing-window__main__list__buttons-section__secondary" onClick={ handleRemovingAllCancel }>Cancel</button>
                <button className="removing-window__main__list__buttons-section__primary" onClick={ handleRemovingAllConfirm }>Remove</button>
              </div>
            </section>

          </section>
        : null }
  </>
  )
}