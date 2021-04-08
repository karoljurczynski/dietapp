import { React } from 'react';
import './styles/productAddingWindow.css';

export default function AddingForm(props) {
  return (
    <>
    <form onSubmit= { props.handleProductAdding }>

      <label htmlFor="name">Product name: </label>
      <input 
        type="text"
        id="name"
        value={ props.data.name } 
        onChange={ props.handleOnChange }
        placeholder={ props.data.isPlaceholderEnabled ? "Product name must be a string!" : null }
        maxLength="32"
        required />

      <label htmlFor="weight">Product weight: </label>
      <input 
        type="text" 
        id="weight"
        value={ props.data.weight } 
        onChange={ props.handleOnChange }
        placeholder={ props.data.isPlaceholderEnabled ? "Weight must be a number different than zero!" : null }
        maxLength="5"
        required />

      <label htmlFor="proteins">Proteins: </label>
      <input 
        type="text" 
        id="proteins"
        value={ props.data.proteins } 
        onChange={ props.handleOnChange }
        placeholder={ props.data.isPlaceholderEnabled ? "Proteins must be a number!" : null }
        maxLength="5"
        required />

      <label htmlFor="fats">Fats: </label>
      <input 
        type="text" 
        id="fats"
        value={ props.data.fats } 
        onChange={ props.handleOnChange }
        placeholder={ props.data.isPlaceholderEnabled ? "Fats must be a number!" : null }
        maxLength="5"
        required />

      <label htmlFor="carbs">Carbs: </label>
      <input 
        type="text" 
        id="carbs"
        value={ props.data.carbs } 
        onChange={ props.handleOnChange }
        placeholder={ props.data.isPlaceholderEnabled ? "Carbs must be a number!" : null }
        maxLength="5"
        required />

      <label htmlFor="kcal">Calories: </label>
      <input 
        type="text" 
        id="kcal"
        value={ props.data.kcal }
        onChange={ props.handleOnChange }
        placeholder={ props.data.isPlaceholderEnabled ? "Calories must be a number!" : null }
        maxLength="5"
        required />

      <input 
        type="submit" 
        value="Add" />

    </form>
    <button onClick={ props.handleAddingWindow }>Cancel</button>
    </>
  )
}