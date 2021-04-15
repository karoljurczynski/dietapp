import { React, useState, useEffect } from 'react';
import './styles/productAddingWindow.css';

export default function AddingForm(props) {
  const initialOptionsStates = {
    'list-saving': false
  };

  const [optionsStates, setOptionsStates] = useState(initialOptionsStates);
  const [isFormCompleted, setIsFormCompleted] = useState(false);
  const [isStateEqualToProps, setIsStateEqualToProps] = useState(true);


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


  // CHECKING IF FORM IS COMPLETED
  useEffect(() => { 
    checkIfFormCompleted();
    checkIfStateIsEqualToProps();
  }, [props, optionsStates])

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

      if(weight && reps)
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

  const saveNewProductToList = (newProduct) => {
    const newList =  JSON.parse(localStorage.getItem("predefined"));
    newList.push(newProduct);
    localStorage.setItem("predefined", JSON.stringify(newList));
  }

  const handleCheckboxOnClick = (e) => {
    setOptionsStates(prevOptions => { return {...prevOptions, [e.target.id]: !optionsStates[e.target.id]} });
  }

  return (
    <>
    { props.type !== 'nutrition' 
      ? <form className="adding-window__main__form" onSubmit={ handleAddSerie }>

          <section className="adding-window__main__form adding-window__main__form--product-info">

            <h3 className="adding-window__main__form__title">Last time</h3>

            <div className="adding-window__main__form__line--normal">
              <label className="adding-window__main__form__line__label" htmlFor="oldWeight">Weight: </label>
              <p 
                className="adding-window__main__form__line__input" 
                id="oldWeight">
                { props.type === 'last-training' ? props.lastTimeData.training.weight : props.lastTimeData.serie.weight }
              </p>
              <span className="adding-window__main__form__line__decoration">kg</span>
            </div>

            <div className="adding-window__main__form__line--normal">
              <label className="adding-window__main__form__line__label" htmlFor="oldReps">Reps: </label>
              <p 
                className="adding-window__main__form__line__input" 
                id="oldReps">
                { props.type === 'last-training' ? props.lastTimeData.training.reps : props.lastTimeData.serie.reps }
              </p>
              <span className="adding-window__main__form__line__decoration">reps</span>
            </div>
          
          </section>

          <section className="adding-window__main__form adding-window__main__form--nutrition-facts">

            <h3 className="adding-window__main__form__title">New serie</h3>

            <div className="adding-window__main__form__line--normal">
              <label className="adding-window__main__form__line__label" htmlFor="weight">Weight: </label>
              <input 
                className="adding-window__main__form__line__input" 
                type="text" 
                id="weight"
                value={ props.data.weight } 
                onChange={ props.handleOnChange }
                placeholder="Weight"
                maxLength="3">
              </input>
              <span className="adding-window__main__form__line__decoration">kg</span>
              <p className="adding-window__main__form__line__warning">{ props.warning[1] === 'weight' ? props.warning[0] : null }</p>
            </div>

            <div className="adding-window__main__form__line--normal">
              <label className="adding-window__main__form__line__label" htmlFor="reps">Reps: </label>
              <input 
                className="adding-window__main__form__line__input" 
                type="text" 
                id="reps"
                value={ props.data.reps } 
                onChange={ props.handleOnChange }
                placeholder="Reps"
                maxLength="2">
              </input>
              <span className="adding-window__main__form__line__decoration">reps</span>
              <p className="adding-window__main__form__line__warning">{ props.warning[1] === 'reps' ? props.warning[0] : null }</p>
            </div>
            
          </section>

          <section className="adding-window__main__form adding-window__main__form--buttons-section">

            <button 
              className={ isStateEqualToProps ? "adding-window__main__form__tertiary adding-window__main__form__tertiary--disabled" : "adding-window__main__form__tertiary" } 
              disabled={ isStateEqualToProps ? true : false }
              type="button" 
              onClick={ handleClearButton }>
              Clear</button>

            <div>
              <button className="adding-window__main__form__secondary" type="button" onClick={ handleCancelButton }>Cancel</button>
              <button 
                className={ isFormCompleted
                            ? "adding-window__main__form__primary"
                            : "adding-window__main__form__primary adding-window__main__form__primary--disabled" }
                type="submit"
                disabled={ isFormCompleted ? false : true }>Add</button>
            </div>

          </section>

        </form>

      : <form className="adding-window__main__form" onSubmit={ handleAddProduct }>

          <section className="adding-window__main__form adding-window__main__form--product-info">


            <h3 className="adding-window__main__form__title">Product info</h3>
            
            <div className="adding-window__main__form__line adding-window__main__form__line--long">
              <label className="adding-window__main__form__line__label" htmlFor="name">Product name: </label>
              <input
                className="adding-window__main__form__line__input" 
                type="text"
                id="name"
                value={ props.data.name }
                onChange={ props.handleOnChange }
                placeholder="Product name"
                maxLength="32">
              </input>
              <p className="adding-window__main__form__line__warning">{ props.warning[1] === 'name' ? props.warning[0] : null }</p>
            </div>

            <div className="adding-window__main__form__line adding-window__main__form__line--short">
              <label className="adding-window__main__form__line__label" htmlFor="weight">Product weight: </label>
              <input 
                className="adding-window__main__form__line__input"
                type="text"
                id="weight"
                value={ props.data.weight } 
                onChange={ props.handleOnChange }
                placeholder="Weight"
                maxLength="4">
              </input>
              <span className="adding-window__main__form__line__decoration">g</span>
              <p className="adding-window__main__form__line__warning">{ props.warning[1] === 'weight' ? props.warning[0] : null }</p>
            </div>


          </section>

          <section className="adding-window__main__form adding-window__main__form--nutrition-facts">
            

            <h3 className="adding-window__main__form__title">Nutrition facts</h3>
            
            <div className="adding-window__main__form__line--normal">
              <label className="adding-window__main__form__line__label" htmlFor="proteins">Proteins: </label>
              <input 
                className="adding-window__main__form__line__input" 
                type="text" 
                id="proteins"
                value={ props.data.proteins } 
                onChange={ props.handleOnChange }
                placeholder="Proteins"
                maxLength="4">
              </input>
              <span className="adding-window__main__form__line__decoration">g</span>
              <p className="adding-window__main__form__line__warning">{ props.warning[1] === 'proteins' ? props.warning[0] : null }</p>
            </div>

            <div className="adding-window__main__form__line--normal">
              <label className="adding-window__main__form__line__label" htmlFor="fats">Fats: </label>
              <input
                className="adding-window__main__form__line__input"  
                type="text" 
                id="fats"
                value={ props.data.fats } 
                onChange={ props.handleOnChange }
                placeholder="Fats"
                maxLength="4">
              </input>
              <span className="adding-window__main__form__line__decoration">g</span>
              <p className="adding-window__main__form__line__warning">{ props.warning[1] === 'fats' ? props.warning[0] : null }</p>
            </div>

            <div className="adding-window__main__form__line--normal">
              <label className="adding-window__main__form__line__label" htmlFor="carbs">Carbs: </label>
              <input
                className="adding-window__main__form__line__input"  
                type="text" 
                id="carbs"
                value={ props.data.carbs } 
                onChange={ props.handleOnChange }
                placeholder="Carbohydrates"
                maxLength="4">
              </input>
              <span className="adding-window__main__form__line__decoration">g</span>
              <p className="adding-window__main__form__line__warning">{ props.warning[1] === 'carbs' ? props.warning[0] : null }</p>
            </div>

            <div className="adding-window__main__form__line--normal">
              <label className="adding-window__main__form__line__label" htmlFor="kcal">Calories: </label>
              <input
                className="adding-window__main__form__line__input"  
                type="text" 
                id="kcal"
                value={ props.data.kcal }
                onChange={ props.handleOnChange }
                placeholder="Calories"
                maxLength="4">
              </input>
              <span className="adding-window__main__form__line__decoration">kcal</span>
              <p className="adding-window__main__form__line__warning">{ props.warning[1] === 'kcal' ? props.warning[0] : null }</p>
            </div>


          </section>

          <section className="adding-window__main__form adding-window__main__form--options">

            <h3 className="adding-window__main__form__title">Options</h3>

            <div className="adding-window__main__form__line adding-window__main__form__line--normal">
              <label className="adding-window__main__form__line__label adding-window__main__form__line__label--options" htmlFor="list-saving">Save to list</label>
              <button 
                className="adding-window__main__form__background"
                id="list-saving"
                type="button"
                onClick={ handleCheckboxOnClick }>
                <div 
                  className="adding-window__main__form__background__checked" 
                  id="list-saving"
                  style={ optionsStates['list-saving'] ? {backgroundColor: "#7500AF"} : {backgroundColor: "transparent"} }>
                </div>
              </button>
            </div>

          </section>

          <section className="adding-window__main__form adding-window__main__form--buttons-section">

            <button 
              className={ isStateEqualToProps ? "adding-window__main__form__tertiary adding-window__main__form__tertiary--disabled" : "adding-window__main__form__tertiary" } 
              disabled={ isStateEqualToProps ? true : false }
              type="button" 
              onClick={ handleClearButton }>
              Clear</button>

            <div>
              <button className="adding-window__main__form__secondary" type="button" onClick={ handleCancelButton }>Cancel</button>
              <button 
                className={ isFormCompleted
                            ? "adding-window__main__form__primary"
                            : "adding-window__main__form__primary adding-window__main__form__primary--disabled" }
                type="submit"
                disabled={ isFormCompleted ? false : true }>Add</button>
            </div>

          </section>

        </form>
    }
    </>
  )
}