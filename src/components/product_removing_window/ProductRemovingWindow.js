import { React } from 'react';
import './styles/productRemovingWindow.css';
 
export default function ProductRemovingWindow(props) {

  const handleSelected = (e) => {
    const product = document.querySelector(`#${e.target.id}`);

    // IF COLOR IS BLACK (SELECTED) THEN RESET TO DEFAULT
    if (product.childNodes[0].style.color === "black") {
      product.childNodes.forEach(child => {
        child.style.cssText = `
          color: gray;
          font-weight: normal;
        `;
      })

      // NUTRITION FACTS
      product.childNodes[1].childNodes.forEach(child => {
        child.style.cssText = `
          color: gray;
          font-weight: normal;
        `;
      })
    }

    else {
      product.childNodes.forEach(child => {
        child.style.cssText = `
          color: black;
          font-weight: bold;
        `;
      })

      // NUTRITION FACTS
      product.childNodes[1].childNodes.forEach(child => {
        child.style.cssText = `
          color: black;
          font-weight: bold;
        `;
      })
    }
  }

  const handleRemoveButton = (e) => {

  }
  
  return (
    <section className="removing-window">

      <h1 className="removing-window__title">Remove product</h1>

      <main className="removing-window__main">

        <ul className="removing-window__main__list removing-window__main__list--heading">
          <li className="removing-window__main__list__item removing-window__main__list__item--heading">
            <span className="removing-window__main__list__item__name">Product name</span>
            <span className="removing-window__main__list__item__nutrition-facts">
              <p className="removing-window__main__list__item__nutrition-facts__proteins" title="Proteins">P</p>
              <p className="removing-window__main__list__item__nutrition-facts__fats" title="Fats">F</p>
              <p className="removing-window__main__list__item__nutrition-facts__carbs" title="Carbohydrates">C</p>
            </span>
            <span className="removing-window__main__list__item__calories">Calories</span>
          </li>
        </ul>

        <ul className="removing-window__main__list">

          { props.productList.map(product => {
            return (
              <li id={ product.name } key={ product.id } className="removing-window__main__list__item">
                <span id={ product.name } className="removing-window__main__list__item__name">{ product.name }</span>
                <span id={ product.name } className="removing-window__main__list__item__nutrition-facts">
                  <p id={ product.name } className="removing-window__main__list__item__nutrition-facts__proteins" title="Proteins">{ product.proteins } g</p>
                  <p id={ product.name } className="removing-window__main__list__item__nutrition-facts__fats" title="Fats">{ product.fats } g</p>
                  <p id={ product.name } className="removing-window__main__list__item__nutrition-facts__carbs" title="Carbohydrates">{ product.carbs } g</p>
                </span>
                <span id={ product.name } className="removing-window__main__list__item__calories">{ product.kcal } kcal</span>
                <input type="checkbox" id={ product.id }></input>
              </li>
            )
          })
          }

        </ul>
        
        <section className="removing-window__main__list__buttons-section">
          <button className="removing-window__main__list__buttons-section__secondary" onClick={ props.handleRemovingWindow }>Cancel</button>
          <button className="removing-window__main__list__buttons-section__primary" onClick={ props.handleProductRemoving }>Remove</button>
        </section>

      </main>

    </section>

    /*<div className="meal__removing-window">
        <form onSubmit={ props.handleProductRemoving }>

          { props.productList.map(product => {
            return (

              <span key={ product.id }>
                <label htmlFor={ product.name }>{ product.name }</label>
                <input type="checkbox" id={ product.id } name={ product.name } />
              </span>

            )
          })}

          <input type="submit" value="Remove"/>
        </form>

        <button onClick={ props.handleRemovingWindow }>Cancel</button>
      </div>*/
  )
}