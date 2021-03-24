// IMPORTS

import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useReducer } from 'react';
import './styles/meal.css';

const ACTIONS = {
  NEGATE_MEAL_STATE: 'negate-meal-state',
  NEGATE_ADDING_WINDOW_STATE: 'negate-adding-window-state',
  NEGATE_REMOVING_WINDOW_STATE: 'negate-removing-window-state',
  ADD_PRODUCT: 'add-product',
  ENABLE_PLACEHOLDER: 'enable-placeholder',
  DISABLE_PLACEHOLDER: 'disable-placeholder',
  REMOVE_PRODUCT: 'remove-product',
  ADD_TO_SUMMARY: 'add-to-summary',
  SUB_FROM_SUMMARY: 'sub-from-summary'
}


// COMPONENTS

export default function Meal(props) {

  // REDUCER STUFF
  const initialState = {
    isMealOpened: false, 
    isAddingWindowOpened: false,
    isRemovingWindowOpened: false,
    countIngredients: false,
    productList: [],
    newProduct: { id: '', mealId: props.mealId,  name: '', weight: '', proteins: '', fats: '', carbs: '', kcal: '' },
    summary: {
      proteins: 0,
      fats: 0,
      carbs: 0,
      kcal: 0
    }
  };

  const reducer = (state, action) => {
    switch(action.type) {
      case ACTIONS.NEGATE_MEAL_STATE:
        return {...state, isMealOpened: !state.isMealOpened};
      
      case ACTIONS.NEGATE_ADDING_WINDOW_STATE:
        return {...state, isAddingWindowOpened: !state.isAddingWindowOpened};

      case ACTIONS.NEGATE_REMOVING_WINDOW_STATE:
        return {...state, isRemovingWindowOpened: !state.isRemovingWindowOpened};

      case ACTIONS.CHANGE_NEW_PRODUCT_DATA: {
        switch (action.payload.key) {
          case 'name':      return {...state, newProduct: {...state.newProduct, name:     action.payload.value}};
          case 'weight':    return {...state, newProduct: {...state.newProduct, weight:   action.payload.value}};
          case 'proteins':  return {...state, newProduct: {...state.newProduct, proteins: action.payload.value}};
          case 'fats':      return {...state, newProduct: {...state.newProduct, fats:     action.payload.value}};
          case 'carbs':     return {...state, newProduct: {...state.newProduct, carbs:    action.payload.value}};
          case 'kcal':      return {...state, newProduct: {...state.newProduct, kcal:     action.payload.value}};
        }
      }

      case ACTIONS.ADD_PRODUCT: {
        state.newProduct.id = Date.now();
        state.productList.push(state.newProduct);
        localStorage.setItem(state.newProduct.id, JSON.stringify(state.newProduct));
        return {...state, newProduct: { id: '', mealId: props.mealId, name: '', weight: '', proteins: '', fats: '', carbs: '', kcal: ''}};
      }

      case ACTIONS.REMOVE_PRODUCT: {
        let newProductList = state.productList;
        let checkedIdList = action.payload;
        
        checkedIdList.forEach(checkedId => {
          newProductList.forEach((product, index) => {
            if (Number(product.id) === Number(checkedId)) {
              newProductList.splice(index, 1);
              localStorage.removeItem(product.id);
            }
          });
        });
        return {...state, productList: newProductList};
      }

      case ACTIONS.ADD_TO_SUMMARY: {
        switch (action.payload.ingredient) {
          case 'proteins': return {...state, summary: {...state.summary, proteins: state.summary.proteins + Number(action.payload.value)}};
          case 'fats':     return {...state, summary: {...state.summary, fats:     state.summary.fats     + Number(action.payload.value)}};
          case 'carbs':    return {...state, summary: {...state.summary, carbs:    state.summary.carbs    + Number(action.payload.value)}};
          case 'kcal':     return {...state, summary: {...state.summary, kcal:     state.summary.kcal     + Number(action.payload.value)}};
        }
      }
      
      case ACTIONS.SUB_FROM_SUMMARY: {
        switch (action.payload.ingredient) {
          case 'proteins': return {...state, summary: {...state.summary, proteins: state.summary.proteins - Number(action.payload.value)}};
          case 'fats':     return {...state, summary: {...state.summary, fats:     state.summary.fats     - Number(action.payload.value)}};
          case 'carbs':    return {...state, summary: {...state.summary, carbs:    state.summary.carbs    - Number(action.payload.value)}};
          case 'kcal':     return {...state, summary: {...state.summary, kcal:     state.summary.kcal     - Number(action.payload.value)}};
        }
      }

      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isPlaceholderEnabled, setPlaceholderState] = useState(false);

  useEffect(() => {
    let localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach(key => {
      let value = JSON.parse(localStorage.getItem(key));
      if (value.mealId === props.mealId) {
        state.productList.push(value);
      }
    });
    state.productList.forEach(product => {
      handleAddingtoSummary(product);
    });
  }, []);
  // END OF REDUCER STUFF

  const handleMealOpening = () => {
    dispatch( {type: ACTIONS.NEGATE_MEAL_STATE} );
  }

  const handleAddingtoSummary = (object) => {
    let keys = Object.keys(object);
    for (let i = 4; i < keys.length; i++) {
      dispatch({
        type: ACTIONS.ADD_TO_SUMMARY,
        payload: {
          ingredient: keys[i],
          value: object[keys[i]]
        }
      });
    };
  }

  const handleSubstractingFromSummary = (object) => {
    let keys = Object.keys(object);
    for (let i = 4; i < keys.length; i++) {
      dispatch({
        type: ACTIONS.SUB_FROM_SUMMARY,
        payload: {
          ingredient: keys[i],
          value: object[keys[i]]
        }
      });
    };
  }

  const handleAddingWindow = () => {
    dispatch( {type: ACTIONS.NEGATE_ADDING_WINDOW_STATE} );
  }

  const handleRemovingWindow = () => {
    dispatch( {type: ACTIONS.NEGATE_REMOVING_WINDOW_STATE} );
  }

  const handleProductAdding = (e) => {
    e.preventDefault();
    dispatch( {type: ACTIONS.ADD_PRODUCT} );
    dispatch( {type: ACTIONS.NEGATE_ADDING_WINDOW_STATE} );
  }

  const handleProductRemoving = (e) => {
    e.preventDefault();

    let checkedIdsList = [];
    for (let i = 0; i < state.productList.length; i++) {
      if (e.target[i].checked)
        checkedIdsList.push(e.target[i].id);
    }

    dispatch( {type: ACTIONS.REMOVE_PRODUCT, payload: checkedIdsList} );
    dispatch( {type: ACTIONS.NEGATE_REMOVING_WINDOW_STATE} );
  }

  const handleOnChange = (e) => {
    const isNumber = /[0-9]/;
    const isWord = /[a-z\s]/i;
    const isZero = /^[0]{1}/;

    const setValueAsZero = () => {
      dispatch({ type: ACTIONS.CHANGE_NEW_PRODUCT_DATA, payload: { key: e.target.id, value: '0' }});
      setPlaceholderState(false);
    }

    const setValueAsNull = () => {
      dispatch({ type: ACTIONS.CHANGE_NEW_PRODUCT_DATA, payload: { key: e.target.id, value: "" } });
      setPlaceholderState(true);
    }

    const setValueAsCorrect = () => {
      dispatch({ type: ACTIONS.CHANGE_NEW_PRODUCT_DATA, payload: { key: e.target.id, value: e.target.value }});
      setPlaceholderState(false);
    }

    if (e.target.id === 'name') {

      isWord.test(e.target.value[e.target.value.length - 1]) ? setValueAsCorrect() : setValueAsNull();

    }

    else {

      if (isNumber.test(e.target.value[e.target.value.length - 1])) {

        if (isZero.test(e.target.value))
          e.target.id === 'weight' ? setValueAsNull() : setValueAsZero();

        else
          setValueAsCorrect();
      }

      else {
        setValueAsNull();
      }

    }
  }

  return (
    <div className="meal" style={ state.isMealOpened ? {marginLeft: '-10px'} : {marginLeft: '0px'} }>
      <section className="meal__top-section" onClick={ handleMealOpening }>
        
        <h2 className="meal__top-section__meal-title">{props.name}</h2>        
        
        <ul className="meal__top-section__meal-stats-list">                   
          <li className="meal__top-section__meal-stats-list__item">{ state.summary.proteins } g</li>
          <li className="meal__top-section__meal-stats-list__item">{ state.summary.fats } g</li>
          <li className="meal__top-section__meal-stats-list__item">{ state.summary.carbs } g</li>
          <li className="meal__top-section__meal-stats-list__item">{ state.summary.kcal } kcal</li>
        </ul> 

      </section>

      {state.productList.length !== 0 ? (
        <section className="meal__products-section" style={ state.isMealOpened ? {display: "flex"} : {display: "none"} }>
       
        { state.productList.map(product => {
          return (
            <Product key={product.id} 
              name={product.name}
              weight={product.weight}
              proteins={product.proteins}
              fats={product.fats}
              carbs={product.carbs}
              kcal={product.kcal}>
            </Product>
          )
        })}

        </section>
      ) : null}

      <section className="meal__buttons-section" style={ state.isMealOpened ? {display: "flex"} : {display: "none"} }>

        <button 
          className="meal__buttons-section__remove-button" 
          onClick={ state.productList.length ? handleRemovingWindow : null } 
          disabled={ state.isAddingWindowOpened || state.isRemovingWindowOpened ? true : false }>
          Remove</button> 

        <button 
          className="meal__buttons-section__add-button" 
          onClick={ handleAddingWindow } 
          disabled={ state.isAddingWindowOpened || state.isRemovingWindowOpened ? true : false }>
          Add</button>       
      
      </section>

      <div className="meal__adding-window" style={ state.isAddingWindowOpened ? {display: "flex"} : {display: "none"}}>

        <form onSubmit= { handleProductAdding }>

          <label htmlFor="name">Product name: </label>
          <input 
            type="text"
            id="name"
            value={ state.newProduct.name } 
            onChange={ handleOnChange }
            placeholder={ isPlaceholderEnabled ? "Product name must be a string!" : null }
            maxLength="32"
            required />

          <label htmlFor="weight">Product weight: </label>
          <input 
            type="text" 
            id="weight"
            value={ state.newProduct.weight } 
            onChange={ handleOnChange }
            placeholder={ isPlaceholderEnabled ? "Weight must be a number different than zero!" : null }
            maxLength="5"
            required />

          <label htmlFor="proteins">Proteins: </label>
          <input 
            type="text" 
            id="proteins"
            value={ state.newProduct.proteins } 
            onChange={ handleOnChange }
            placeholder={ isPlaceholderEnabled ? "Proteins must be a number!" : null }
            maxLength="5"
            required />

          <label htmlFor="fats">Fats: </label>
          <input 
            type="text" 
            id="fats"
            value={ state.newProduct.fats } 
            onChange={ handleOnChange }
            placeholder={ isPlaceholderEnabled ? "Fats must be a number!" : null }
            maxLength="5"
            required />

          <label htmlFor="carbs">Carbs: </label>
          <input 
            type="text" 
            id="carbs"
            value={ state.newProduct.carbs } 
            onChange={ handleOnChange }
            placeholder={ isPlaceholderEnabled ? "Carbs must be a number!" : null }
            maxLength="5"
            required />

          <label htmlFor="kcal">Calories: </label>
          <input 
            type="text" 
            id="kcal"
            value={ state.newProduct.kcal }
            onChange={ handleOnChange }
            placeholder={ isPlaceholderEnabled ? "Calories must be a number!" : null }
            maxLength="5"
            required />

          <input 
            type="submit" 
            value="Add" />
          
          <button onClick={ handleAddingWindow }>Cancel</button>

        </form>
      </div>

      <div className="meal__removing-window" style={ state.isRemovingWindowOpened ? {display: "flex"} : {display: "none"}}>
        <form onSubmit={ handleProductRemoving }>

          {state.productList.map(product => {
            return (

              <span key={ product.id }>
                <label htmlFor={ product.name }>{ product.name }</label>
                <input type="checkbox" id={ product.id } name={ product.name } />
              </span>

            )
          })}

          <input type="submit" value="Remove"/>
          <button onClick={ handleRemovingWindow }>Cancel</button>
        </form>
      </div>
    
    </div>
  )
}

function Product(props) {

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
        <li className="meal__products-section__product__stats-list__item">{props.kcal} kcal</li>
      </ul>
    </div>
  )
}

/*

class Meal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: true,
      proteinsSummary: 0,
      fatsSummary: 0,
      carbsSummary: 0,
      kcalSummary: 0,
      style: {
        left: '0px',
      }};
    this.isOpened = this.isOpened.bind(this);
    this.fromCenterMealSection = this.fromCenterMealSection.bind(this);
  }
  isOpened() {
    if(this.state.isClicked === false)
      this.setState({isClicked: true, style: {left: '0px'}});
    else
      this.setState({isClicked: false, style: {left: '-10px'}});
  }
  fromCenterMealSection(arg) {
    return arg;
  }
  render() {
    return (
      <div className="main__meal" style={this.state.style}>
        <TopMealSection 
          title={this.props.title}
          proteins={this.state.proteinsSummary}
          fats={this.state.fatsSummary}
          carbs={this.state.carbsSummary}
          kcal={this.state.kcalSummary}
          isClicked={this.isOpened}
          />
        <CenterMealSection 
          isOpened={this.state.isClicked}
          toMealSection={this.fromCenterMealSection}
        />
        <BottomMealSection 
          isOpened={this.state.isClicked}
        />
      </div>

    );
  }
}


// SECONDARY COMPONENTS

class TopMealSection extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }
  handleOnClick() {
    if(this.props.isClicked === true) {
      this.props.isClicked(false);
    }
    else {
      this.props.isClicked(true);
    }
  }
  render() {
    return (

      <section 
        className="main__meal__top" 
        onClick={this.handleOnClick}>
        <MealTitle 
          title={this.props.title}
        />
        <NutritionStats 
          proteins={this.props.proteins}
          fats={this.props.fats}
          carbs={this.props.carbs}
          kcal={this.props.kcal}
        />
      </section>

    );
  }
}

class CenterMealSection extends React.Component {
  constructor(props) {
    super(props);
    this.changeDisplay = this.changeDisplay.bind(this);
    this.sendToMealSection = this.sendToMealSection.bind(this);
  }
  changeDisplay() {
    if(this.props.isOpened === true)
      return {display: "none"};
    else
      return {display: "flex"};
  }
  // SENDING DATA
  sendToMealSection(arg) {
    this.props.toMealSection(arg);
  }
  // SENDING DATA
  render() {
    return (

      <section className="main__meal__center" style={this.changeDisplay()}>
        <Product 
          productName={"Cottage cheese"}
          productWeight={200}
          proteins={40}
          fats={10}
          carbs={60}
          kcal={450}
          // SENDING DATA
          toCenterMealSection={this.sendToMealSection}
          // SENDING DATA
        />
      </section>

    );
  }
}

class BottomMealSection extends React.Component {
  constructor(props) {
    super(props);
  }
  changeDisplay() {
    if(this.props.isOpened === true)
      return {display: "none"};
    else
      return {display: "flex"};
  }
  render() {
    return (

      <section className="main__meal__bottom" style={this.changeDisplay()}>
        <ButtonsSection />
      </section>

    );
  }
}


// TERTIARY COMPONENTS

class MealTitle extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <h4 className="main__meal__top__title">{this.props.title}</h4>

    );
  }
}

class NutritionStats extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="main__meal__top__nutrition-stats">
        <Ingredient type="proteins" value={this.props.proteins} size="large"/>
        <Ingredient type="fats" value={this.props.fats} size="large"/>
        <Ingredient type="carbs" value={this.props.carbs} size="large"/>
        <Ingredient type="kcal" value={this.props.kcal} size="large"/>
      </section>

    );
  }
}

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.sendToCenterSection = this.sendToCenterSection.bind(this);
  }
  // SENDING DATA
  sendToCenterSection() {
    this.props.toCenterMealSection(this.props);
  }
  // SENDING DATA
  render() {
    // SENDING DATA
    this.sendToCenterSection();
    // SENDING DATA
    return (

      <section className="main__meal__center__product">
        <ProductInfo 
          productName={this.props.productName}
          productWeight={this.props.productWeight}
        />
        <ProductStats 
          proteins={this.props.proteins}
          fats={this.props.fats}
          carbs={this.props.carbs}
          kcal={this.props.kcal}
        />
      </section>

    );
  }
}

class ButtonsSection extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="main__meal__bottom__buttons-section">
        <Button type="remove" name="Remove" title="Remove" />
        <Button type="add" name="Add" title="Remove" />
      </section>

    );
  }
}

class Ingredient extends React.Component {
  constructor(props) {
    super(props);
    this.className = '';
    this.unit = '';
  }
  isKcal() {
    if (this.props.type === "kcal") {
      this.unit = "kcal";
      return true;
    } 
    else {
      this.unit = "g";
      return false;
    }
  }
  isSmall() {
    if (this.props.size === "small") {
      this.isKcal() 
      ? this.className = "main__meal__center__product__stats__ingredient main__meal__center__product__stats__ingredient--kcal"
      : this.className = "main__meal__center__product__stats__ingredient";
    }
    else {
      this.isKcal() 
      ? this.className = "main__meal__top__nutrition-stats__ingredient main__meal__top__nutrition-stats__ingredient--kcal"
      : this.className = "main__meal__top__nutrition-stats__ingredient";
    }
  }
  render() {
    this.isKcal();
    this.isSmall();
    return (

      <h4 className={this.className}>{`${this.props.value} ${this.unit}`}</h4>

    );
  }
}

class ProductInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="main__meal__center__product__info">
        <ProductName 
          productName={this.props.productName}
        />
        <ProductWeight 
          productWeight={this.props.productWeight}  
        />
      </section>

    );
  }
}

class ProductStats extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="main__meal__center__product__stats">
        <Ingredient type="proteins" value={this.props.proteins} size="small"/>
        <Ingredient type="fats" value={this.props.fats} size="small"/>
        <Ingredient type="carbs" value={this.props.carbs} size="small"/>
        <Ingredient type="kcal" value={this.props.kcal} size="small"/>
      </section>

    );
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.className = '';
  }
  isRemovingButton() {
    if (this.props.type === "remove")
      this.className = "main__meal__bottom__buttons-section__remove-button";
    else
      this.className = "main__meal__bottom__buttons-section__add-button";
  }
  render() {
    this.isRemovingButton();
    return (

      <button className={this.className} title={this.props.title}>{this.props.name}</button>

    );
  }
}

class ProductName extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <h4 className="main__meal__center__product__info__name">{this.props.productName}</h4>

    );
  }
}

class ProductWeight extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <p className="main__meal__center__product__info__weight">{this.props.productWeight} g</p>
      
    );
  }
}
 */