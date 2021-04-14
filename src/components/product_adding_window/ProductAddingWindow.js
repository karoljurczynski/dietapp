import { React, useState, useEffect } from 'react';
import AddingForm from './AddingForm';
import AddingList from './AddingList';
import './styles/productAddingWindow.css';

export default function AddWindow(props) {

  // ENABLE POINTER EVENTS IN ADDING WINDOW AFTER MOUNTING
  useEffect(() => { 
    const addingWindow = document.querySelector(".adding-window");
    addingWindow.style.pointerEvents = "auto";
    
    }, []);

  const [isAddingTypeSetAtFromList, setAddingType] = useState(true);

  const changeAddingType = () => {
    setAddingType(!isAddingTypeSetAtFromList);
  }

  return (
    <>

    <div className="adding-window__background-blur"></div>
    
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
              warning={ props.warning }
              handleAddingWindow={ props.handleAddingWindow }
              handlePredefinedProductsAdding={ props.handlePredefinedProductsAdding }
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
              warning={ props.warning }
              handleOnChange={ props.handleOnChange }
              handleFormClearing={ props.handleFormClearing }
              handleProductAdding={ props.handleProductAdding }
              handleAddingWindow={ props.handleAddingWindow }
            />
        }
      </main>

    </section>
    </>
  )
}