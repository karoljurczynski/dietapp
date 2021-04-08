import { React } from 'react';
import './styles/productAddingWindow.css';

export default function AddingList(props) {

  const handleProductEdit = () => {

  }

  const savedProductList = [
    { name: "Cottage cheese", proteins: 20, fats: 10, carbs: 15, kcal: 250 },
    { name: "Skyr", proteins: 20, fats: 0, carbs: 12, kcal: 100 },
    { name: "Potatos", proteins: 9, fats: 2, carbs: 80, kcal: 126 },
    { name: "Coca Cola", proteins: 0, fats: 0, carbs: 100, kcal: 400 },
    { name: "Banana", proteins: 5, fats: 3, carbs: 52, kcal: 173 },
    { name: "Cottage cheese", proteins: 20, fats: 10, carbs: 15, kcal: 250 },
    { name: "Skyr", proteins: 20, fats: 0, carbs: 12, kcal: 100 },
    { name: "Potatos", proteins: 9, fats: 2, carbs: 80, kcal: 126 },
    { name: "Coca Cola", proteins: 0, fats: 0, carbs: 100, kcal: 400 },
    { name: "Banana", proteins: 5, fats: 3, carbs: 52, kcal: 173 }
  ]

  return (
    <>
      <ul className="adding-window__main__adding-list adding-window__main__adding-list--heading">
        <li className="adding-window__main__adding-list__item adding-window__main__adding-list__item--heading">
          <span className="adding-window__main__adding-list__item__name">Product name</span>
          <span className="adding-window__main__adding-list__item__nutrition-facts">
            <p className="adding-window__main__adding-list__item__nutrition-facts__proteins" title="Proteins">P</p>
            <p className="adding-window__main__adding-list__item__nutrition-facts__fats" title="Fats">F</p>
            <p className="adding-window__main__adding-list__item__nutrition-facts__carbs" title="Carbohydrates">C</p>
          </span>
          <span className="adding-window__main__adding-list__item__calories">per 100 g</span>
        </li>
      </ul>

      <ul className="adding-window__main__adding-list">

        { savedProductList.map(product => {
          return (
            <li className="adding-window__main__adding-list__item" onClick={ handleProductEdit }>
              <span className="adding-window__main__adding-list__item__name">{ product.name }</span>
              <span className="adding-window__main__adding-list__item__nutrition-facts">
                <p className="adding-window__main__adding-list__item__nutrition-facts__proteins" title="Proteins">{ product.proteins } g</p>
                <p className="adding-window__main__adding-list__item__nutrition-facts__fats" title="Fats">{ product.fats } g</p>
                <p className="adding-window__main__adding-list__item__nutrition-facts__carbs" title="Carbohydrates">{ product.carbs } g</p>
              </span>
              <span className="adding-window__main__adding-list__item__calories">{ product.kcal } kcal</span>
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
  )
}