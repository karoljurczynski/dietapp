import { React, useState } from 'react';
import './styles/productAddingWindow.css';

export default function AddingForm(props) {

  const [isChecked, setIsChecked] = useState(false);

  const handleClearButton = () => {
    props.handleFormClearing();
  }

  const handleCancelButton = () => {
    props.handleAddingWindow();
  }

  const handleCheckbox = () => {
    setIsChecked(!isChecked);
  }

  return (
    <form className="adding-window__main__form" onSubmit={ props.handleProductAdding }>

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
            maxLength="32"
            required>
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
            maxLength="4"
            required>
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
            maxLength="4"
            required>
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
            maxLength="4"
            required>
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
            maxLength="4"
            required>
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
            maxLength="4"
            required>
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
            type="button">
            
            <div
              className="adding-window__main__form__background__checked" 
              style={ isChecked ? {backgroundColor: "#7500AF"} : {backgroundColor: "transparent"}}
              onClick={ handleCheckbox }>
            </div>
          </button>
        </div>

      </section>

      <section className="adding-window__main__form adding-window__main__form--buttons-section">


        <button className="adding-window__main__form__tertiary" type="button" onClick={ handleClearButton }>Clear</button>

        <div>
          <button className="adding-window__main__form__secondary" type="button" onClick={ handleCancelButton }>Cancel</button>
          <input className="adding-window__main__form__primary" type="submit" value="Add"></input>
        </div>
      

      </section>
      
    </form>
  )
}