import { React, useState } from 'react';
import AddingForm from './AddingForm';
import AddingList from './AddingList';
import './styles/productAddingWindow.css';

export default function ProductAddingWindow(props) {

  const [isAddingTypeSetAtFromList, setAddingType] = useState(true);

  const changeAddingType = () => {
    setAddingType(!isAddingTypeSetAtFromList);
  }

  return (
    <section className="adding-window">

      <h1 className="adding-window__title">Add product</h1>

      <button className="adding-window__switch" onClick={ changeAddingType }>
        <h3 
          className={ isAddingTypeSetAtFromList 
                      ? "adding-window__switch__left adding-window__switch__left--selected"
                      : "adding-window__switch__left" }>
          From list
        </h3>
        <h3 
          className={ isAddingTypeSetAtFromList 
                      ? "adding-window__switch__right"
                      : "adding-window__switch__right adding-window__switch__right--selected" }>
          Your own
        </h3>
      </button>

      <main className="adding-window__main">
        { isAddingTypeSetAtFromList
          ? <AddingList 
              handleAddingWindow={ props.handleAddingWindow }
              handleProductAdding={ props.handleProductAdding }
            />
          : <AddingForm 
              data={{ 
                isPlaceholderEnabled: props.data.isPlaceholderEnabled,
                name: props.data.name, 
                weight: props.data.weight,
                proteins: props.data.proteins,
                fats: props.data.fats,
                carbs: props.data.carbs,
                kcal: props.data.kcal }}
              handleOnChange={ props.handleOnChange }
              handleProductAdding={ props.handleProductAdding }
              handleAddingWindow={ props.handleAddingWindow }
            />
        }
      </main>

    </section>
  )
}