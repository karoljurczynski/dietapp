import { React } from 'react';
import './styles/productAddingWindow.css';

export default function AddingForm(props) {

  const handleClearingForm = () => {
    

  }

  return (
    <form className="adding-window__main__adding-form" onSubmit={ props.handleProductAdding }>

      <section className="adding-window__main__adding-form__product-info">


        <h3 className="adding-window__main__adding-form__product-info__title">Product info</h3>
        
        <div className="adding-window__main__adding-form__product-info__line">
          <label className="adding-window__main__adding-form__product-info__line__label" htmlFor="name">Product name: </label>
          <input
            className="adding-window__main__adding-form__product-info__line__input" 
            type="text"
            id="name"
            value={ props.data.name } 
            onChange={ props.handleOnChange }
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
            value={ props.data.weight } 
            onChange={ props.handleOnChange }
            placeholder="Weight"
            maxLength="5"
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
          <input 
            className="adding-window__main__adding-form__nutrition-facts__line__input" 
            type="text" 
            id="proteins"
            value={ props.data.proteins } 
            onChange={ props.handleOnChange }
            placeholder="Proteins"
            maxLength="5"
            required>
          </input>
          <span className="adding-window__main__adding-form__nutrition-facts__line__decoration">g</span>
          <p className="adding-window__main__adding-form__nutrition-facts__line__warning">You are idiot</p>
        </div>

        <div className="adding-window__main__adding-form__nutrition-facts__line">
          <label className="adding-window__main__adding-form__nutrition-facts__line__label" htmlFor="fats">Fats: </label>
          <input
            className="adding-window__main__adding-form__nutrition-facts__line__input"  
            type="text" 
            id="fats"
            value={ props.data.fats } 
            onChange={ props.handleOnChange }
            placeholder="Fats"
            maxLength="5"
            required>
          </input>
          <span className="adding-window__main__adding-form__nutrition-facts__line__decoration">g</span>
          <p className="adding-window__main__adding-form__nutrition-facts__line__warning">You are idiot</p>
        </div>

        <div className="adding-window__main__adding-form__nutrition-facts__line">
          <label className="adding-window__main__adding-form__nutrition-facts__line__label" htmlFor="carbs">Carbs: </label>
          <input
            className="adding-window__main__adding-form__nutrition-facts__line__input"  
            type="text" 
            id="carbs"
            value={ props.data.carbs } 
            onChange={ props.handleOnChange }
            placeholder="Carbohydrates"
            maxLength="5"
            required>
          </input>
          <span className="adding-window__main__adding-form__nutrition-facts__line__decoration">g</span>
          <p className="adding-window__main__adding-form__nutrition-facts__line__warning">You are idiot</p>
        </div>

        <div className="adding-window__main__adding-form__nutrition-facts__line">
          <label className="adding-window__main__adding-form__nutrition-facts__line__label" htmlFor="kcal">Calories: </label>
          <input
            className="adding-window__main__adding-form__nutrition-facts__line__input"  
            type="text" 
            id="kcal"
            value={ props.data.kcal }
            onChange={ props.handleOnChange }
            placeholder="Calories"
            maxLength="5"
            required>
          </input>
          <span className="adding-window__main__adding-form__nutrition-facts__line__decoration">kcal</span>
          <p className="adding-window__main__adding-form__nutrition-facts__line__warning">You are idiot</p>
        </div>


      </section>

      <section className="adding-window__main__adding-form__buttons-section">


        <button className="adding-window__main__adding-form__buttons-section__tertiary" onClick={ handleClearingForm }>Clear</button>
        
        <div className="adding-window__main__adding-form__buttons-section__right">
          <button className="adding-window__main__adding-form__buttons-section__secondary" onClick={ props.handleAddingWindow }>Cancel</button>
          <input className="adding-window__main__adding-form__buttons-section__primary" type="submit" value="Add"></input>
        </div>
      

      </section>
      
    </form>
  )
}