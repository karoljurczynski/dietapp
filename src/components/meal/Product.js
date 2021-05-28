// IMPORTS

import { React, useEffect } from 'react';


// COMPONENT

export default function Product(props) {

  // EFFECTS

  // ADDS INGREDIENTS VALUES TO SUMMARY OR SUBSTRACTS AFTER DELETING PRODUCT
  useEffect(() => { 
    let ingredients = { proteins: props.proteins, fats: props.fats, carbs: props.carbs, kcal: props.kcal };
    props.addIngredientsFunction(ingredients);

    return () => {
      props.subIngredientsFunction(ingredients);
    }

  }, []);


  // RETURN

  return (
    <div className="meal__products-section__product">
      <div className="meal__products-section__product__info">
        <h2 className="meal__products-section__product__title">{props.name}</h2>          
        <p className="meal__products-section__product__weight">{props.weight} g</p>           
      </div>
        
      <ul className="meal__products-section__product__stats-list">             
        <li className="meal__products-section__product__stats-list__item">{props.proteins} g</li>
        <li className="meal__products-section__product__stats-list__item">{props.fats} g</li>
        <li className="meal__products-section__product__stats-list__item">{props.carbs} g</li>
        <li className="meal__products-section__product__stats-list__item meal__products-section__product__stats-list__item--kcal">{props.kcal} kcal</li>
      </ul>
    </div>
  )
}