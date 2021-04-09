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
    if(e.target.id) {
      const productName = product.querySelector(".removing-window__main__list__item__name");

      // "UNSELECTING"
      if (productName.style.fontWeight === "bold") {
        product.style.background = "#ffffff";
        productName.style.fontWeight = "normal";
      }

      // "SELECTING"
      else {
        product.style.background = "#7500AF30";
        productName.style.fontWeight = "bold";
      }
    }
  }

  const handleRemoveButton = () => {
    const selectedIds = [];
    const products = document.querySelectorAll(".removing-window__main__list__item");

    products.forEach(product => {
      const name = product.querySelector(".removing-window__main__list__item__name")
      if(name.style.fontWeight === "bold")
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
              <div className="removing-window__main__list__wrapper">
                <span className="removing-window__main__list__item__name" style={{color: "white"}}>Product name</span>
                <span className="removing-window__main__list__item__nutrition-facts">
                  <p className="removing-window__main__list__item__nutrition-facts__proteins" title="Proteins">P</p>
                  <p className="removing-window__main__list__item__nutrition-facts__fats" title="Fats">F</p>
                  <p className="removing-window__main__list__item__nutrition-facts__carbs" title="Carbohydrates">C</p>
                </span>
                <span className="removing-window__main__list__item__calories">Calories</span>
              </div>
            </li>
          </ul>

          <ul className="removing-window__main__list">

            { props.productList.map(product => {
              return (

                <li onClick={ handleSelected } id={ product.id } key={ product.id } className="removing-window__main__list__item">
                <div className="removing-window__main__list__wrapper">
                  <span id={ product.id } className="removing-window__main__list__item__name">{ product.name }</span>
                  <span id={ product.id } className="removing-window__main__list__item__nutrition-facts">
                    <p id={ product.id } className="removing-window__main__list__item__nutrition-facts__proteins" title="Proteins">{ product.proteins } g</p>
                    <p id={ product.id } className="removing-window__main__list__item__nutrition-facts__fats" title="Fats">{ product.fats } g</p>
                    <p id={ product.id } className="removing-window__main__list__item__nutrition-facts__carbs" title="Carbohydrates">{ product.carbs } g</p>
                  </span>
                  <span id={ product.id } className="removing-window__main__list__item__calories">{ product.kcal } kcal</span>
                </div>
                <span id={ product.id } className="removing-window__main__list__item__weight">{ product.weight } g</span>
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