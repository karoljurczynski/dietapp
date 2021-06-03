// IMPORTS

import { React, useState, useEffect, useReducer } from 'react';
import AddWindow from '../product_adding_window/ProductAddingWindow';
import RemoveWindow from '../product_removing_window/ProductRemovingWindow';
import Product from './Product';
import './styles/meal.css';

import { db } from '../../index'; 
import { collection, getDocs, setDoc, doc } from "firebase/firestore";




// VARIABLES

export const warnings = {
  name:   "Name must be a string of letters only",
  weight: "Weight must be a positive number",
  macros: "Macronutrient must be a number"
}

const ACTIONS = {
  NEGATE_MEAL_STATE: 'negate-meal-state',
  NEGATE_ADDING_WINDOW_STATE: 'negate-adding-window-state',
  NEGATE_REMOVING_WINDOW_STATE: 'negate-removing-window-state',
  ADD_PRODUCT: 'add-product',
  ENABLE_PLACEHOLDER: 'enable-placeholder',
  DISABLE_PLACEHOLDER: 'disable-placeholder',
  SET_WARNING: 'set-warning',
  CLEAR_WARNING: 'clear-warning',
  REMOVE_PRODUCT: 'remove-product',
  ADD_TO_SUMMARY: 'add-to-summary',
  SUB_FROM_SUMMARY: 'sub-from-summary',
  CLEAR_PRODUCTLIST_BEFORE_DAY_CHANGING: 'clear-productlist-before-day-changing',
  ADD_PRODUCT_TO_PRODUCTLIST: 'add-product-to-productlist'
}

// COMPONENT

export default function Meal(props) {

  // VARIABLES

  const saveProductInDatabase = async (product, moreThanOne = false) => {
    console.log(product);
    let newProductList = [];
    let oldProductList = [];

    // CHECKING IF PRODUCTLIST EXIST
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach(user => {
        if (user.id === props.userId) {
          if (user.data().productList)
            oldProductList = user.data().productList;
        }
      });
    }
    catch (e) {
      console.error(e);
    }

    // ADDING PRODUCT TO NEW LIST
    if (moreThanOne) {
      let modifiedSelectedProducts = product.map((item, index) => {
        return {
          ...item,
          mealId: props.mealId,
          dateIds: props.dateIds,
          id: Date.now() + index * 10
        }
      });

      newProductList = oldProductList.concat(modifiedSelectedProducts);
    }

    else {
      newProductList = oldProductList;
      newProductList.push(product);
    }
    
    // OVERWRITING OLD PRODUCTLIST USING NEW LIST
    try {
      await setDoc(doc(db, "users", String(props.userId)), {
        productList: newProductList
      },
      { merge: true });
    }
    catch (e) {
      console.error(e);
    }

    clearProductList();
    loadProductListFromDatabase();
  }

  const removeProductsFromDatabase = async (selectedProducts) => {
    let oldProductList = [];
    let newProductList = [];

    // GETTING ALL PRODUCTS SAVED IN DATABASE
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach(user => {
        if (user.id === props.userId) {
          if (user.data().productList)
            oldProductList = user.data().productList;
        }
      });
    }
    catch (e) {
      console.error(e);
    }

    newProductList = oldProductList;

    // DELETING SELECTED PRODUCTS
    selectedProducts.forEach(selectedId => {
      newProductList.forEach((product, index) => {
        if (Number(product.id) === Number(selectedId)) {
          newProductList.splice(index, 1);
        }
      });
    });

    // OVERWRITING PRODUCTLIST USING NEW
    try {
      await setDoc(doc(db, "users", String(props.userId)), {
        productList: newProductList
      },
      { merge: true });
    }
    catch (e) {
      console.error(e);
    }
  }
 
  const initialState = {
    isMealOpened: false, 
    isAddingWindowOpened: false,
    isRemovingWindowOpened: false,
    countIngredients: false,
    productList: [],
    newProduct: { id: 0, mealId: props.mealId, dateIds: { dayId: 0, monthId: 0, yearId: 0 },  name: '', weight: '', proteins: '', fats: '', carbs: '', kcal: '' },
    warning: ['', ''],
    summary: {
      proteins: 0,
      fats: 0,
      carbs: 0,
      kcal: 0
    }
  };


  // HOOKS

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
        state.newProduct.dateIds = props.dateIds;
        state.productList.push(state.newProduct);
        saveProductInDatabase(state.newProduct);
        return {...state, newProduct: { id: 0, mealId: props.mealId, dateIds: { dayId: 0, monthId: 0, yearId: 0 }, name: '', weight: '', proteins: '', fats: '', carbs: '', kcal: ''}};
      }

      case ACTIONS.SET_WARNING: {
        switch (action.payload) {
          case 'name':  return { ...state, warning: [warnings.name, action.payload] }
          case 'weight':  return { ...state, warning: [warnings.weight, action.payload] }
          default:  return { ...state, warning: [warnings.macros, action.payload] }
        };
      }

      case ACTIONS.CLEAR_WARNING: {
        return { ...state, warning: ['', action.payload]};
      }

      case ACTIONS.REMOVE_PRODUCT: {
        let newProductList = state.productList;
        let checkedIdList = action.payload;

        if (props.userId.length > 1)
          removeProductsFromDatabase(checkedIdList);

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

      case ACTIONS.ADD_PRODUCT_TO_PRODUCTLIST: {
        return {...state, productList: [...state.productList, action.payload]};
      }

      case ACTIONS.CLEAR_PRODUCTLIST_BEFORE_DAY_CHANGING: {
        return {...state, productList: []};
      }

      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isPlaceholderEnabled, setPlaceholderState] = useState(false);

  const loadProductListFromDatabase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach(user => {
        if (user.id === props.userId) {
          if (user.data().productList) {
            user.data().productList.forEach(product => {
              if (product.mealId === props.mealId && ((product.dateIds.dayId === props.dateIds.dayId) &&
                                            (product.dateIds.monthId === props.dateIds.monthId) &&
                                            (product.dateIds.yearId === props.dateIds.yearId)))
                dispatch({ type: ACTIONS.ADD_PRODUCT_TO_PRODUCTLIST, payload: product });
            });
          }
        }
      });
    }

    catch (e) {
      console.error(e);
    }
  }

  const clearProductList = () => {
    dispatch({ type: ACTIONS.CLEAR_PRODUCTLIST_BEFORE_DAY_CHANGING });
  }

  // EFFECTS

  // LOADS PRODUCTS FROM DATABASE
  useEffect(() => {
    clearProductList();
    loadProductListFromDatabase();

  }, [ props.userId, props.dateIds ]);


  // CLOSES WINDOWS AFTER DAY CHANGE
  useEffect(() => {
    const disableVisibilityIfEnabled = (state, action) => {
      if (state)
        dispatch({type: action});
    }
    
    disableVisibilityIfEnabled(state.isMealOpened, ACTIONS.NEGATE_MEAL_STATE);
    disableVisibilityIfEnabled(state.isAddingWindowOpened, ACTIONS.NEGATE_ADDING_WINDOW_STATE);
    disableVisibilityIfEnabled(state.isRemovingWindowOpened, ACTIONS.NEGATE_REMOVING_WINDOW_STATE);

  }, [ props.dateIds ])

  // SENDS DATA FROM MEAL TO GAUGES
  useEffect(() => { 
    props.updateGauges(state.summary, props.mealId);

  }, [ state.summary ]);

  // DISABLES POINTER EVENTS WHEN ONE OF FORM WINDOWS IS OPENED 
  useEffect(() => {
    const changePointerEvents = (value) => {
      const meals = document.querySelectorAll(".meal");
      const wrapper = document.querySelector(".wrapper");
      const center = document.querySelector(".center-section");

      meals.forEach(meal => {
        let buttons = meal.querySelector(".meal__buttons-section");
        buttons.style.pointerEvents = value;
        wrapper.style.pointerEvents = value;

        // DISABLING SCROLL AT CENTER SECTION 
        value === "none" ? center.style.overflowY = "hidden" : center.style.overflowY = "auto";
      });
    }


    state.isAddingWindowOpened || state.isRemovingWindowOpened
    ? changePointerEvents("none")
    : changePointerEvents("auto");
    
  }, [ state.isAddingWindowOpened, state.isRemovingWindowOpened ]);

  
  // FUNCTIONS

  const handleMealOpening = () => {
    dispatch( {type: ACTIONS.NEGATE_MEAL_STATE} );
  }

  const handleAddingToSummary = (object) => {
    Object.keys(object).forEach(key => {
      dispatch({
        type: ACTIONS.ADD_TO_SUMMARY,
        payload: {
          ingredient: key,
          value: object[key]
        }
      });
    });
  }

  const handleSubstractingFromSummary = (object) => {
    Object.keys(object).forEach(key => {
      dispatch({
        type: ACTIONS.SUB_FROM_SUMMARY,
        payload: {
          ingredient: key,
          value: object[key]
        }
      });
    });
    
  }

  const handleAddWindow = () => {
    dispatch( {type: ACTIONS.NEGATE_ADDING_WINDOW_STATE} );
  }

  const handleRemoveWindow = () => {
    dispatch( {type: ACTIONS.NEGATE_REMOVING_WINDOW_STATE} );
  }

  const handleProductAdding = (e) => {
    e.preventDefault();
    setTimeout(() => { dispatch({ type: ACTIONS.ADD_PRODUCT }) }, 10);
    dispatch({ type: ACTIONS.NEGATE_ADDING_WINDOW_STATE });
  }

  const handlePredefinedProductsAdding = (selectedProducts) => {
    if (props.userId) {
      saveProductInDatabase(selectedProducts, true);
    }
    else {
      selectedProducts.forEach(product => {

        // TIMEOUT TO PREVENT DOUBLED IDS
        setTimeout(() => {
  
          Object.keys(product).forEach(key => {
            dispatch({ type: ACTIONS.CHANGE_NEW_PRODUCT_DATA, payload: { key: key, value: product[key] }});
          });
          dispatch({ type: ACTIONS.ADD_PRODUCT });
  
        }, 100);
  
      });
    }
    dispatch({ type: ACTIONS.NEGATE_ADDING_WINDOW_STATE });
  }

  const handleProductRemoving = (checkedIdsList) => {
    dispatch({ type: ACTIONS.REMOVE_PRODUCT, payload: checkedIdsList });
    dispatch({ type: ACTIONS.NEGATE_REMOVING_WINDOW_STATE });
  }

  const handleFormClearing = () => {
    dispatch({ type: ACTIONS.CHANGE_NEW_PRODUCT_DATA, payload: { key: 'name', value: '' }});
    dispatch({ type: ACTIONS.CHANGE_NEW_PRODUCT_DATA, payload: { key: 'weight', value: '' }});
    dispatch({ type: ACTIONS.CHANGE_NEW_PRODUCT_DATA, payload: { key: 'proteins', value: '' }});
    dispatch({ type: ACTIONS.CHANGE_NEW_PRODUCT_DATA, payload: { key: 'fats', value: '' }});
    dispatch({ type: ACTIONS.CHANGE_NEW_PRODUCT_DATA, payload: { key: 'carbs', value: '' }});
    dispatch({ type: ACTIONS.CHANGE_NEW_PRODUCT_DATA, payload: { key: 'kcal', value: '' }});
    setPlaceholderState(false);
  }

  const handleOnChange = (e) => {
    const isNumber = /[0-9]/;
    const isWord = /[a-z\s]/i;
    const isZero = /^[0]{1}/;

    const setValueAsZero = () => {
      dispatch({ type: ACTIONS.CHANGE_NEW_PRODUCT_DATA, payload: { key: e.target.id, value: '0' }});
      dispatch({ type: ACTIONS.CLEAR_WARNING, payload: e.target.id });
    }

    const setValueAsNull = () => {
      dispatch({ type: ACTIONS.CHANGE_NEW_PRODUCT_DATA, payload: { key: e.target.id, value: "" } });
      dispatch({ type: ACTIONS.SET_WARNING, payload: e.target.id });
    }

    const setValueAsCorrect = () => {
      dispatch({ type: ACTIONS.CHANGE_NEW_PRODUCT_DATA, payload: { key: e.target.id, value: e.target.value }});
      dispatch({ type: ACTIONS.CLEAR_WARNING, payload: e.target.id });
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


  // RETURN

  return (
    <div className="meal" style={ (state.isMealOpened && window.innerWidth > 768) ? {left: '-10px'} : {left: '0px'} }>
      <section className="meal__top-section" onClick={ props.userStatus === "Log in" ? props.loginShortcut : handleMealOpening }>
        
        <h2 className="meal__top-section__meal-title">{props.name}</h2>        
        
        <ul className="meal__top-section__meal-stats-list">                   
          <li className="meal__top-section__meal-stats-list__item">{ state.summary.proteins } g</li>
          <li className="meal__top-section__meal-stats-list__item">{ state.summary.fats } g</li>
          <li className="meal__top-section__meal-stats-list__item">{ state.summary.carbs } g</li>
          <li className="meal__top-section__meal-stats-list__item">{ state.summary.kcal } kcal</li>
        </ul> 

      </section>

      { state.productList.length !== 0 ? (
        <section className="meal__products-section" style={ state.isMealOpened ? {display: "flex"} : {display: "none"} }>
       
        { state.productList.map(product => {
          return (
            <Product key={ product.id } 
              name={ product.name }
              weight={ product.weight }
              proteins={ product.proteins }
              fats={ product.fats }
              carbs={ product.carbs }
              kcal={ product.kcal }
              addIngredientsFunction={ handleAddingToSummary }
              subIngredientsFunction={ handleSubstractingFromSummary }>
            </Product>
          )
        })}

        </section>
      ) : null }
      
      <section className="meal__buttons-section" style={ state.isMealOpened ? {display: "flex"} : {display: "none"} }>
        <div>
        <button 
          className={ state.productList.length ? "meal__buttons-section__remove-button" : "meal__buttons-section__remove-button meal__buttons-section__remove-button--disabled" } 
          onClick={ state.productList.length ? handleRemoveWindow : null } 
          disabled={ state.isAddingWindowOpened || state.isRemovingWindowOpened ? true : false }>
          Remove</button> 

        <button 
          className="meal__buttons-section__add-button" 
          onClick={ handleAddWindow } 
          disabled={ state.isAddingWindowOpened || state.isRemovingWindowOpened ? true : false }>
          Add</button>  
        </div>     
      
      </section>

      { state.isAddingWindowOpened 
        ? <AddWindow 
            data={{ 
              isPlaceholderEnabled: isPlaceholderEnabled,
              name: state.newProduct.name, 
              weight: state.newProduct.weight,
              proteins: state.newProduct.proteins,
              fats: state.newProduct.fats,
              carbs: state.newProduct.carbs,
              kcal: state.newProduct.kcal }}
            warning={ state.warning }
            handleOnChange={ handleOnChange }
            handleFormClearing={ handleFormClearing }
            handleProductAdding={ handleProductAdding }
            handleAddWindow={ handleAddWindow }
            handlePredefinedProductsAdding={ handlePredefinedProductsAdding }
          />
        : null }

      { state.isRemovingWindowOpened 
        ? <RemoveWindow
            list={ state.productList }
            handleRemoving={ handleProductRemoving }
            handleRemoveWindow={ handleRemoveWindow }
          />
        : null }

    </div>
  )
}