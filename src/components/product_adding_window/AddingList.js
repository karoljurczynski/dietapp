// IMPORTS

import { React, useReducer, useEffect } from 'react';
import EditForm from './EditForm';
import { FaPlusCircle } from 'react-icons/fa';

import { db } from '../../index'; 
import { getDoc, setDoc, doc } from "firebase/firestore";


// VARIABLES

const ACTIONS = {
  SET_PRODUCT_SEND_FOR_EDIT: "set-product-send-for-edit",
  NEGATE_EDIT_WINDOW_STATE: "negate-edit-window-state",
  UPDATE_SAVED_PRODUCTS_LIST: "update-saved-products-list",
  LOAD_PREDEFINED_PRODUCTS_LIST_FROM_LOCAL_STORAGE: 'load-predefined-products-list-from-local-storage',
  SET_IS_ADD_BUTTON_DISABLED: 'set-is-add-button-disabled'
}

const initialState = {
  savedProductList: [
    { id: 0, name: "Cottage cheese", weight: 100, proteins: 20, fats: 10, carbs: 15, kcal: 250 },
    { id: 1, name: "Skyr", weight: 100, proteins: 20, fats: 0, carbs: 12, kcal: 100 },
    { id: 2, name: "Potatos", weight: 100, proteins: 9, fats: 2, carbs: 80, kcal: 126 },
    { id: 3, name: "Coca Cola", weight: 100, proteins: 0, fats: 0, carbs: 100, kcal: 400 },
    { id: 4, name: "Banana", weight: 100, proteins: 5, fats: 3, carbs: 52, kcal: 173 }],
  
  productSendForEdit: { id: 0, name: '', weight: 0, proteins: 0, fats: 0, carbs: 0, kcal: 0 },
  isEditWindowOpened: false,
  isAddButtonDisabled: false
}


// COMPONENT

export default function AddingList(props) {

  // HOOKS

  const reducer = (state, action) => {
    switch (action.type) {

      case ACTIONS.LOAD_PREDEFINED_PRODUCTS_LIST_FROM_LOCAL_STORAGE: {
        return {...state, savedProductList: action.payload}
      }

      case ACTIONS.NEGATE_EDIT_WINDOW_STATE: {
        return { ...state, isEditWindowOpened: !state.isEditWindowOpened };
      }

      case ACTIONS.SET_PRODUCT_SEND_FOR_EDIT: {
        return {...state, productSendForEdit: {
                          id: action.payload.id,
                          name: action.payload.name,
                          weight: action.payload.weight,
                          proteins: action.payload.proteins,
                          fats: action.payload.fats,
                          carbs: action.payload.carbs,
                          kcal: action.payload.kcal }
        };
      }

      case ACTIONS.UPDATE_SAVED_PRODUCTS_LIST: {
        const newSavedProductList = state.savedProductList;
        newSavedProductList[action.payload.index] = action.payload.newProduct;
        return {...state, savedProductList: newSavedProductList};
      }

      case ACTIONS.SET_IS_ADD_BUTTON_DISABLED: {
        return {...state, isAddButtonDisabled: action.payload};
      }

      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);


  // EFFECTS

  const updatePredefinedProductsInDatabase = async (newList) => {
    try {
      await setDoc(doc(db, "predefinedProducts", "predefinedProductsList"), {
        list: newList
      },
      { merge: true });
    }
    catch (e) {
      console.error(e);
    }
  }

  const getPredefinedProductsFromDatabase = async () => {
    let predefinedProductsList = [];
    try {
      const querySnapshot = await getDoc(doc(db, "predefinedProducts", "predefinedProductsList"));
      predefinedProductsList = querySnapshot.data().list;
      if (!predefinedProductsList)
        updatePredefinedProductsInDatabase(state.savedProductList)
    }    
    catch (e) {
      console.error(e);
    }
    dispatch({ type: ACTIONS.LOAD_PREDEFINED_PRODUCTS_LIST_FROM_LOCAL_STORAGE, payload: predefinedProductsList });
  }

  // LOADS PREDEFINED PRODUCTS LIST FROM LOCALSTORAGE OR CREATES IF DOESN'T EXIST
  useEffect(() => { 
    getPredefinedProductsFromDatabase();
  }, []);

  // DISABLES ADD BUTTON AFTER MOUNTING
  useEffect(() => { 
    handleAddButtonDisabling() 
  }, [])


  // FUNCTIONS

  const handleSelected = (e) => {
    const product = document.getElementById(e.currentTarget.id);
    if (e.currentTarget.id) {
      const productName = product.querySelector(".window__main__section__large-list__item__name");

      // "UNSELECTING"
      if (productName.style.fontWeight === "bold") {
        product.style.background = "#ffffff";
        productName.style.fontWeight = "normal";
        handleAddButtonDisabling();
      }

      // "SELECTING"
      else {
        product.style.background = "#7500AF30";
        productName.style.fontWeight = "bold";
        updateProductSendForEdit(state.savedProductList[getIndexOfProduct(e.currentTarget.id)]);
        handleEditingWindow();
      }
    }
  }

  const updateProductSendForEdit = (selectedProduct) => {
    dispatch({ type: ACTIONS.SET_PRODUCT_SEND_FOR_EDIT, payload: selectedProduct });
  }

  const handleProductEditing = (editedProduct) => {
    const indexOfEditedProduct = getIndexOfProduct(editedProduct.id);
    dispatch({ type: ACTIONS.UPDATE_SAVED_PRODUCTS_LIST, payload: { index: indexOfEditedProduct, newProduct: editedProduct }})
    
    // SAVING CHANGES TO LOCAL STORAGE
    updatePredefinedProductsInDatabase(state.savedProductList);
    handleEditingWindow();
  }

  const handleEditingWindow = (idOfSelectedProduct = false) => {
    
    // UNSELECTING PRODUCT AFTER EDIT CANCELED
    if (Number.isInteger(idOfSelectedProduct)) {
      const product = document.getElementById(idOfSelectedProduct);
      const productName = product.querySelector(".window__main__section__large-list__item__name");
      product.style.background = "#ffffff";
      productName.style.fontWeight = "normal";
    }
    
    dispatch({ type: ACTIONS.NEGATE_EDIT_WINDOW_STATE });
    handleAddButtonDisabling();
  }

  const handleAddButtonDisabling = () => {
    const products = document.querySelectorAll(".window__main__section__large-list__item");
    let returnedBoolean = false;
   
    for (let i = 0; i < products.length; i++) {
      const name = products[i].querySelector(".window__main__section__large-list__item__name");
      if (name.style.fontWeight === "bold") {
        returnedBoolean = false;
        break;
      }

      else
        returnedBoolean = true;
    }

    dispatch({type: ACTIONS.SET_IS_ADD_BUTTON_DISABLED, payload: returnedBoolean});
  }

  const handleProductsAdding = () => {
    const selectedProducts = [];
    const products = document.querySelectorAll(".window__main__section__large-list__item");

    products.forEach((product, index) => {
      const name = product.querySelector(".window__main__section__large-list__item__name");
      if (name.style.fontWeight === "bold")
        selectedProducts.push(
          { 
            name:     state.savedProductList[index - 1].name,
            weight:   state.savedProductList[index - 1].weight, 
            proteins: state.savedProductList[index - 1].proteins, 
            fats:     state.savedProductList[index - 1].fats, 
            carbs:    state.savedProductList[index - 1].carbs, 
            kcal:     state.savedProductList[index - 1].kcal 
          }
        );
    });

    if (selectedProducts.length !== 0)
      props.handlePredefinedProductsAdding(selectedProducts);
  }

  const getIndexOfProduct = (targetId) => {
    const productList = state.savedProductList;
    let returnedIndex = 0;

    productList.forEach((product, index) => {
      if (product.id === Number(targetId))
        returnedIndex = index;
    });
    return returnedIndex;
  }

  
  // RETURN

  return (
    <>
      <button 
        className={ !state.isAddButtonDisabled
                    ? "window__header__add-button"
                    : "window__header__add-button window__header__add-button--disabled" }
        type="button"
        style={{ zIndex: 11 }}
        onClick={ handleProductsAdding }
        disabled={ state.isAddButtonDisabled ? true : false }><FaPlusCircle />
      </button>

       { state.isEditWindowOpened 
        ? <EditForm 
          data={{
            id: state.productSendForEdit.id,
            name: state.productSendForEdit.name,
            weight: state.productSendForEdit.weight,
            proteins: state.productSendForEdit.proteins,
            fats: state.productSendForEdit.fats,
            carbs: state.productSendForEdit.carbs,
            kcal: state.productSendForEdit.kcal
          }}
          warning={ props.warning }
          handleProductEditing={ handleProductEditing }
          handleEditingWindow={ handleEditingWindow }
          />

        :  null }
        
      <ul className="window__main__section__large-list window__main__section__large-list--heading">
        <li className="window__main__section__large-list__item window__main__section__large-list__item--heading">
          <div className="window__main__section__large-list__wrapper">
            <span className="window__main__section__large-list__item__name" style={{ color: "white" }}>Product name</span>
            <span className="window__main__section__large-list__item__nutrition-facts">
              <p className="window__main__section__large-list__item__nutrition-facts__proteins" title="Proteins">P</p>
              <p className="window__main__section__large-list__item__nutrition-facts__fats" title="Fats">F</p>
              <p className="window__main__section__large-list__item__nutrition-facts__carbs" title="Carbohydrates">C</p>
            </span>
            <span className="window__main__section__large-list__item__calories">Calories</span>
          </div>
        </li>
      </ul>

      <ul className="window__main__section__large-list">

        { state.savedProductList.map(product => {
          return (
            <li id={ product.id } key={ product.id } className="window__main__section__large-list__item" onClick={ handleSelected }>
              <div className="window__main__section__large-list__wrapper">
                <span id={ product.id } className="window__main__section__large-list__item__name">{ product.name }</span>
                <span id={ product.id } className="window__main__section__large-list__item__nutrition-facts">
                  <p id={ product.id } className="window__main__section__large-list__item__nutrition-facts__proteins" title="Proteins">{ product.proteins } g</p>
                  <p id={ product.id } className="window__main__section__large-list__item__nutrition-facts__fats" title="Fats">{ product.fats } g</p>
                  <p id={ product.id } className="window__main__section__large-list__item__nutrition-facts__carbs" title="Carbohydrates">{ product.carbs } g</p>
                </span>
                <span id={ product.id } className="window__main__section__large-list__item__calories">{ product.kcal } kcal</span>
              
              </div>
              <span id={ product.id } className="window__main__section__large-list__item__weight">{ product.weight } g</span>
            </li>
          )
        })
        }

      </ul>
      
      <section className="window__bottom">
        <div></div>
        <div>
          <button 
            className="window__bottom__secondary-button" 
            onClick={ props.handleAddWindow }>
            Cancel
          </button>
          
          <button 
            className={ state.isAddButtonDisabled
                        ? "window__bottom__primary-button window__bottom__primary-button--disabled" 
                        : "window__bottom__primary-button" } 
            onClick={ handleProductsAdding }>
            Add
          </button>
        </div>
      </section>
    </> 
  )
}