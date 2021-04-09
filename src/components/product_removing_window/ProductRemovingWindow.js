import { React, useState, useEffect } from 'react';
import './styles/productRemovingWindow.css';
 
export default function ProductRemovingWindow(props) {
  const [isRemovingAllButtonPressed, setRemovingAllButtonPressed] = useState(false);

  useEffect(() => {
    const removingWindow = document.querySelector(".removing-window");

    if (isRemovingAllButtonPressed) {
      removingWindow.style.filter = "blur(4px)";
      removingWindow.style.pointerEvents = "none";
    }
    else {
      removingWindow.style.filter = "none";
      removingWindow.style.pointerEvents = "auto";
    }
  }, [isRemovingAllButtonPressed]);

  const handleSelected = (e) => {
    const product = document.getElementById(e.target.id);
    const productsNutritionFacts = product.childNodes[1].childNodes;
    const changeFont = (element, color, weight) => {
      element.style.cssText = `
        color: ${color};
        font-weight: ${weight};
      `;
    }
    
    // "UNSELECTING" CHANGING FONT PROPERTIES BACK TO DEFAULT
    if (product.childNodes[0].style.color === "black") {
      product.childNodes.forEach(child => changeFont(child, "#707070", "normal"));
      productsNutritionFacts.forEach(child => changeFont(child, "#707070", "normal"));
    }

    // "SELECTING" CHANGING FONT PROPERTIES TO BLACK AND BOLD
    else {
      product.childNodes.forEach(child => changeFont(child, "black", "bold"));
      productsNutritionFacts.forEach(child => changeFont(child, "black", "bold"));
    }
  }

  const handleRemoveButton = () => {
    const selectedIds = [];
    const products = document.querySelectorAll(".removing-window__main__list__item");

    products.forEach(product => {
      if(product.childNodes[0].style.color === "black")
        selectedIds.push(Number(product.id));
    });

    if (selectedIds.length !== 0)
      props.handleProductRemoving(selectedIds);
  }

  const handleRemovingAllButton = () => {
    setRemovingAllButtonPressed(true);
  }

  const handleRemovingAllCancel = () => {
    setRemovingAllButtonPressed(false);
  }

  const handleRemovingAllConfirm = () => {
    const selectedIds = [];
    const products = document.querySelectorAll(".removing-window__main__list__item");

    products.forEach(product => {
      selectedIds.push(Number(product.id))
    });

    props.handleProductRemoving(selectedIds);
  }
  
  return (
    <>
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

                <li onClick={ handleSelected } id={ product.id } key={ product.id } className="removing-window__main__list__item">
                  <span id={ product.id } className="removing-window__main__list__item__name">{ product.name }</span>
                  <span id={ product.id } className="removing-window__main__list__item__nutrition-facts">
                    <p id={ product.id } className="removing-window__main__list__item__nutrition-facts__proteins" title="Proteins">{ product.proteins } g</p>
                    <p id={ product.id } className="removing-window__main__list__item__nutrition-facts__fats" title="Fats">{ product.fats } g</p>
                    <p id={ product.id } className="removing-window__main__list__item__nutrition-facts__carbs" title="Carbohydrates">{ product.carbs } g</p>
                  </span>
                  <span id={ product.id } className="removing-window__main__list__item__calories">{ product.kcal } kcal</span>
                </li>

              )})
            }

          </ul>
          
          <section className="removing-window__main__list__buttons-section">
            <button className="removing-window__main__list__buttons-section__tertiary" onClick={ handleRemovingAllButton }>Remove all</button>
            <div>
              <button className="removing-window__main__list__buttons-section__secondary" onClick={ props.handleRemovingWindow }>Cancel</button>
              <button className="removing-window__main__list__buttons-section__primary" onClick={ handleRemoveButton }>Remove</button>
            </div>
          </section>

        </main>

      </section>

      { isRemovingAllButtonPressed 
        ? <section className="removing-window__confirm">

            <h1 className="removing-window__title">Remove all?</h1> 

            <h3 className="removing-window__confirm__subtitle">Are you sure you want to remove all products in current meal?</h3>

            <section className="removing-window__main__list__buttons-section" style={{ justifyContent: "flex-end" }}>
              <div>
                <button className="removing-window__main__list__buttons-section__secondary" onClick={ handleRemovingAllCancel }>Cancel</button>
                <button className="removing-window__main__list__buttons-section__primary" onClick={ handleRemovingAllConfirm }>Remove</button>
              </div>
            </section>

          </section>
        : null }
  </>
  )
}