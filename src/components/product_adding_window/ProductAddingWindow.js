import { React, useState, useEffect } from 'react';
import AddingForm from './AddingForm';
import AddingList from './AddingList';
import './styles/productAddingWindow.css';

export default function AddWindow(props) {
  const [isAddingTypeSetAtLeftOption, setAddingType] = useState(true);

  // ENABLE POINTER EVENTS IN ADDING WINDOW AFTER MOUNTING
  useEffect(() => { 
    const addingWindow = document.querySelector(".adding-window");
    addingWindow.style.pointerEvents = "auto";
    
  }, []);

  // CLEARING FORM AFTER EACH CHANGE OF SWITCH OPTION
  useEffect(() => {
    props.handleFormClearing();
  },[isAddingTypeSetAtLeftOption]);

  const changeAddingType = () => {
    setAddingType(!isAddingTypeSetAtLeftOption);
  }

  return (
    <>
      <div className="adding-window__background-blur"></div>

      <section className="adding-window">

        <h1 className="adding-window__title">{ props.type === 'exercises' ? "Add serie" : "Add product" }</h1>

        <button className="adding-window__switch" onClick={ changeAddingType }>
            <h3 
              className={ isAddingTypeSetAtLeftOption 
                          ? "adding-window__switch__left adding-window__switch__left--selected"
                          : "adding-window__switch__left" }>
              { props.type === 'exercises' ? "Last training" : "From list" }
            </h3>
            <h3 
              className={ isAddingTypeSetAtLeftOption 
                          ? "adding-window__switch__right"
                          : "adding-window__switch__right adding-window__switch__right--selected" }>
              { props.type === 'exercises' ? "Last serie" : "Your own" }
            </h3>
          </button>

        { props.type === 'exercises'

          ? <main className="adding-window__main">
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

          : <main className="adding-window__main">
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

      </section>

    </>
  )
}