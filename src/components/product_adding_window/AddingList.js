import { useState } from 'react';
import { React } from 'react';
import EditForm from './EditForm';
import './styles/productAddingWindow.css';


const savedProductList = [
  { id: 0, name: "Cottage cheese", weight: 100, proteins: 20, fats: 10, carbs: 15, kcal: 250 },
  { id: 1, name: "Skyr", weight: 100, proteins: 20, fats: 0, carbs: 12, kcal: 100 },
  { id: 2, name: "Potatos", weight: 100, proteins: 9, fats: 2, carbs: 80, kcal: 126 },
  { id: 3, name: "Coca Cola", weight: 100, proteins: 0, fats: 0, carbs: 100, kcal: 400 },
  { id: 4, name: "Banana", weight: 100, proteins: 5, fats: 3, carbs: 52, kcal: 173 },
  { id: 5, name: "Cottage cheese", weight: 100, proteins: 20, fats: 10, carbs: 15, kcal: 250 },
  { id: 6, name: "Skyr", weight: 100, proteins: 20, fats: 0, carbs: 12, kcal: 100 },
  { id: 7, name: "Potatos", weight: 100, proteins: 9, fats: 2, carbs: 80, kcal: 126 },
  { id: 8, name: "Coca Cola", weight: 100, proteins: 0, fats: 0, carbs: 100, kcal: 400 },
  { id: 9, name: "Banana", weight: 100, proteins: 5, fats: 3, carbs: 52, kcal: 173 }
];

export default function AddingList(props) {
  const initialProductSendForEdit = { id: 0, name: '', weight: 0, proteins: 0, fats: 0, carbs: 0, kcal: 0 };
  const [isEditWindowOpened, setEditWindowOpened] = useState(false); 
  const [productSendForEdit, setProductSendForEdit] = useState(initialProductSendForEdit);

  const updateProductSendForEdit = (selectedProduct) => {
    setProductSendForEdit({
      id: selectedProduct.id,
      name: selectedProduct.name,
      weight: selectedProduct.weight,
      proteins: selectedProduct.proteins,
      fats: selectedProduct.fats,
      carbs: selectedProduct.carbs,
      kcal: selectedProduct.kcal
    });
  }

  const handleSelected = (e) => {
    const product = document.getElementById(e.target.id);
    if (e.target.id) {
      const productName = product.querySelector(".adding-window__main__adding-list__item__name");

      // "UNSELECTING"
      if (productName.style.fontWeight === "bold") {
        product.style.background = "#ffffff";
        productName.style.fontWeight = "normal";
      }

      // "SELECTING"
      else {
        product.style.background = "#7500AF30";
        productName.style.fontWeight = "bold";
        updateProductSendForEdit(savedProductList[e.target.id]);
        handleEditingWindow();
      }
    }
  }

  const handleProductEditing = (editedProduct) => {
    console.log(editedProduct);
    //props.handleProductAdding();
  }

  const handleEditingWindow = () => {
    setEditWindowOpened(!isEditWindowOpened);
  }

  return (
    <>
      { isEditWindowOpened 
        ? <EditForm 
            handleProductEditing={ handleProductEditing }
            handleEditingWindow={ handleEditingWindow }
            data={{
              id: productSendForEdit.id,
              name: productSendForEdit.name,
              weight: productSendForEdit.weight,
              proteins: productSendForEdit.proteins,
              fats: productSendForEdit.fats,
              carbs: productSendForEdit.carbs,
              kcal: productSendForEdit.kcal
            }}
            
          />

        : <> 
          <ul className="adding-window__main__adding-list adding-window__main__adding-list--heading">
            <li className="adding-window__main__adding-list__item adding-window__main__adding-list__item--heading">
            <div className="adding-window__main__adding-list__wrapper">
                <span className="adding-window__main__adding-list__item__name" style={{ color: "white" }}>Product name</span>
                <span className="adding-window__main__adding-list__item__nutrition-facts">
                  <p className="adding-window__main__adding-list__item__nutrition-facts__proteins" title="Proteins">P</p>
                  <p className="adding-window__main__adding-list__item__nutrition-facts__fats" title="Fats">F</p>
                  <p className="adding-window__main__adding-list__item__nutrition-facts__carbs" title="Carbohydrates">C</p>
                </span>
                <span className="adding-window__main__adding-list__item__calories">Calories</span>
              </div>
            </li>
          </ul>

          <ul className="adding-window__main__adding-list">

            { savedProductList.map(product => {
              return (
                <li id={ product.id } key={ product.id } className="adding-window__main__adding-list__item" onClick={ handleSelected }>
                  <div className="adding-window__main__adding-list__wrapper">
                    <span id={ product.id } className="adding-window__main__adding-list__item__name">{ product.name }</span>
                    <span id={ product.id } className="adding-window__main__adding-list__item__nutrition-facts">
                      <p id={ product.id } className="adding-window__main__adding-list__item__nutrition-facts__proteins" title="Proteins">{ product.proteins } g</p>
                      <p id={ product.id } className="adding-window__main__adding-list__item__nutrition-facts__fats" title="Fats">{ product.fats } g</p>
                      <p id={ product.id } className="adding-window__main__adding-list__item__nutrition-facts__carbs" title="Carbohydrates">{ product.carbs } g</p>
                    </span>
                    <span id={ product.id } className="adding-window__main__adding-list__item__calories">{ product.kcal } kcal</span>
                  
                  </div>
                  <span id={ product.id } className="adding-window__main__adding-list__item__weight">{ product.weight } g</span>
                </li>
              )
            })
            }

          </ul>
          
          <section className="adding-window__main__adding-list__buttons-section">
            <button className="adding-window__main__adding-list__buttons-section__secondary" onClick={ props.handleAddingWindow }>Cancel</button>
            <button className="adding-window__main__adding-list__buttons-section__primary" onClick={ props.handleProductEdit }>Add</button>
          </section>
        </>
        }
    </>
  )
}