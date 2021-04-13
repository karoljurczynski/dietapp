import { React, useReducer, useEffect } from 'react';
import EditForm from './EditForm';
import './styles/productAddingWindow.css';

const ACTIONS = {
  SET_PRODUCT_SEND_FOR_EDIT: "set-product-send-for-edit",
  NEGATE_EDIT_WINDOW_STATE: "negate-edit-window-state",
  UPDATE_SAVED_PRODUCTS_LIST: "update-saved-products-list",
  LOAD_PREDEFINED_PRODUCTS_LIST_FROM_LOCAL_STORAGE: 'load-predefined-products-list-from-local-storage'
}

const initialState = {
  savedProductList: [
    { id: 0, name: "Cottage cheese", weight: 100, proteins: 20, fats: 10, carbs: 15, kcal: 250 },
    { id: 1, name: "Skyr", weight: 100, proteins: 20, fats: 0, carbs: 12, kcal: 100 },
    { id: 2, name: "Potatos", weight: 100, proteins: 9, fats: 2, carbs: 80, kcal: 126 },
    { id: 3, name: "Coca Cola", weight: 100, proteins: 0, fats: 0, carbs: 100, kcal: 400 },
    { id: 4, name: "Banana", weight: 100, proteins: 5, fats: 3, carbs: 52, kcal: 173 }],
  
  productSendForEdit: { id: 0, name: '', weight: 0, proteins: 0, fats: 0, carbs: 0, kcal: 0 },
  isEditWindowOpened: false
}

export default function AddingList(props) {

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
        console.log(newSavedProductList);

        return {...state, savedProductList: newSavedProductList};
      }

      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  // EFFECT WHICH LOAD / CREATE PREDEFINED PRODUCTS LIST FROM / TO LOCAL STORAGE
  useEffect(() => { 
    let predefinedProductsList = [];

    if (Object.keys(localStorage).includes('predefined')) {
      predefinedProductsList = JSON.parse(localStorage.getItem("predefined"));
      dispatch({ type: ACTIONS.LOAD_PREDEFINED_PRODUCTS_LIST_FROM_LOCAL_STORAGE, payload: predefinedProductsList });
    }
    else {
      predefinedProductsList = state.savedProductList;
      localStorage.setItem("predefined", JSON.stringify(predefinedProductsList)); 
    }

   }, []);

  useEffect(() => {
    const addingWindow = document.querySelector(".adding-window");

    state.isEditWindowOpened
    ? addingWindow.style.boxShadow = "none"
    : addingWindow.style.boxShadow = "1px 1px 5px #707070";

  }, [state.isEditWindowOpened]);

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
        updateProductSendForEdit(state.savedProductList[getIndexOfProduct(e.target.id)]);
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
    const predefinedProductsList = state.savedProductList;
    localStorage.setItem("predefined", JSON.stringify(predefinedProductsList));
    
    handleEditingWindow();
  }

  const handleEditingWindow = () => {
    dispatch({ type: ACTIONS.NEGATE_EDIT_WINDOW_STATE });
  }

  const handleProductsAdding = () => {
    const selectedProducts = [];
    const products = document.querySelectorAll(".adding-window__main__adding-list__item");

    products.forEach((product, index) => {
      const name = product.querySelector(".adding-window__main__adding-list__item__name");
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

  return (
    <> 
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

        { state.savedProductList.map(product => {
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
        <button className="adding-window__main__adding-list__buttons-section__primary" onClick={ handleProductsAdding }>Add</button>
      </section>

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
    </>
  )
}