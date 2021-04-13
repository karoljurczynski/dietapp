import { React, useReducer} from 'react';
import './styles/productAddingWindow.css';
import { warnings } from '../meal/Meal';

const ACTIONS = {
  UPDATE_PRODUCT_DATA: 'update-product-data',
  RESET_FORM: 'reset-form',
  SET_WARNING: 'set-warning',
  CLEAR_WARNING: 'clear-warning'
}

export default function EditForm(props) {
  const initialState = {
    productData: {
      id: props.data.id,
      name: props.data.name,
      weight: props.data.weight,
      proteins: props.data.proteins,
      fats: props.data.fats,
      carbs: props.data.carbs,
      kcal: props.data.kcal
    },
    warning: ['' ,'']
  } 
    
  const reducer = (state, action) => {
    switch (action.type) {

      case ACTIONS.UPDATE_PRODUCT_DATA: {
        switch (action.payload.key) {
          case 'name':     { return { ...state, productData: {...state.productData, name:     action.payload.value } }};
          case 'weight':   { return { ...state, productData: {...state.productData, weight:   action.payload.value } }};
          case 'proteins': { return { ...state, productData: {...state.productData, proteins: action.payload.value } }};
          case 'fats':     { return { ...state, productData: {...state.productData, fats:     action.payload.value } }};
          case 'carbs':    { return { ...state, productData: {...state.productData, carbs:    action.payload.value } }};
          case 'kcal':     { return { ...state, productData: {...state.productData, kcal:     action.payload.value } }};
          default:         { return console.error(`Unknown action type: ${action.type}`) };
        }
      }

      case ACTIONS.RESET_FORM: {
        return {...state, productData: 
          { id: props.data.id,
            name: props.data.name,
            weight: props.data.weight,
            proteins: props.data.proteins,
            fats: props.data.fats,
            carbs: props.data.carbs,
            kcal: props.data.kcal 
        }};
      }

      case ACTIONS.SET_WARNING: {
        console.log(action.payload)
        if (action.payload === 'name')
          return { ...state, warning: [warnings.name, action.payload] }
        else 
          return { ...state, warning: [warnings.weight, action.payload] }
      }

      case ACTIONS.CLEAR_WARNING: {
        return { ...state, warning: ['', action.payload] }
      }

      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleResetingForm = (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.RESET_FORM });
    dispatch({ type: ACTIONS.CLEAR_WARNING });
  }

  const calculateNutritionFacts = (e) => {
    const isNumber = /[0-9]/;
    const isZero = /^[0]{1}/;

    const nutritionPerOneGram = {
      proteins: Number(props.data.proteins) / Number(props.data.weight),
      fats: Number(props.data.fats) / Number(props.data.weight),
      carbs: Number(props.data.carbs) / Number(props.data.weight),
      kcal: Number(props.data.kcal) / Number(props.data.weight)
    };

    const setValueAsNull = () => {
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'weight', value: '' }});
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'proteins', value: 0 }});
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'fats', value: 0 }});
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'carbs', value: 0 }});
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'kcal', value: 0 }});
      dispatch({ type: ACTIONS.SET_WARNING, payload: 'weight' });
    }

    const setValueAsCorrect = () => {
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'weight', value: Number(e.target.value) } });
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'proteins', value: Math.round( e.target.value * nutritionPerOneGram.proteins) } });
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'fats', value: Math.round( e.target.value * nutritionPerOneGram.fats) } });
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'carbs', value: Math.round( e.target.value * nutritionPerOneGram.carbs) } });
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'kcal', value: Math.round( e.target.value * nutritionPerOneGram.kcal) } });
      dispatch({ type: ACTIONS.CLEAR_WARNING, payload: 'weight' });
    }

    if (isNumber.test(e.target.value[e.target.value.length - 1])) {
      isZero.test(e.target.value)
      ? setValueAsNull()
      : setValueAsCorrect();
    }

    else {
      setValueAsNull();
    }
  }

  const handleNameChanging = (e) => {
    const isWord = /[a-z\s]/i;
    e.preventDefault();
    if (isWord.test(e.target.value[e.target.value.length - 1])) {
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'name', value: e.target.value }})
      dispatch({ type: ACTIONS.CLEAR_WARNING, payload: 'name'});
    }
    else {
      dispatch({ type: ACTIONS.UPDATE_PRODUCT_DATA, payload: { key: 'name', value: "" }});
      dispatch({ type: ACTIONS.SET_WARNING, payload: 'name'});
    }
  }

  const handleSavingChanges = (e) => {
    e.preventDefault();
    props.handleProductEditing(state.productData);
  }

  return (
    <section className="adding-window__edit">

      <h1 className="adding-window__title adding-window__title--edit">Edit product</h1>

      <main className="adding-window__main">

        <form className="adding-window__main__form adding-window__main__form--edit"  onSubmit={ handleSavingChanges }>

          <section className="adding-window__main__form adding-window__main__form--product-info">


            <h3 className="adding-window__main__form__title">Product info</h3>
            
            <div className="adding-window__main__form__line adding-window__main__form__line--long">
              <label className="adding-window__main__form__line__label" htmlFor="name">Product name: </label>
              <input
                className="adding-window__main__form__line__input" 
                type="text"
                id="name"
                value={ state.productData.name } 
                onChange={ handleNameChanging }
                placeholder="Product name"
                maxLength="32"
                required>
              </input>
              <p className="adding-window__main__form__line__warning">{ state.warning[1] === 'name' ? state.warning[0] : null }</p>
            </div>

            <div className="adding-window__main__form__line adding-window__main__form__line--short">
              <label className="adding-window__main__form__line__label" htmlFor="weight">Product weight: </label>
              <input 
                className="adding-window__main__form__line__input" 
                type="text" 
                id="weight"
                value={ state.productData.weight } 
                onChange={ calculateNutritionFacts }
                placeholder="Weight"
                maxLength="4"
                required>
              </input>
              <span className="adding-window__main__form__line__decoration">g</span>
              <p className="adding-window__main__form__line__warning">{ state.warning[1] === 'weight' ? state.warning[0] : null }</p>
            </div>


          </section>

          <section className="adding-window__main__form adding-window__main__form--nutrition-facts">
            

            <h3 className="adding-window__main__form__title">Nutrition facts</h3>
            
            <div className="adding-window__main__form__line adding-window__main__form__line--normal">
              <label className="adding-window__main__form__line__label" htmlFor="proteins">Proteins: </label>
              <p 
                className="adding-window__main__form__line__input" 
                id="proteins">
                { state.productData.proteins }
              </p>
              <span className="adding-window__main__form__line__decoration">g</span>
            </div>

            <div className="adding-window__main__form__line adding-window__main__form__line--normal">
              <label className="adding-window__main__form__line__label" htmlFor="fats">Fats: </label>
              <p 
                className="adding-window__main__form__line__input" 
                id="fats">
                { state.productData.fats }
              </p>
              <span className="adding-window__main__form__line__decoration">g</span>
            </div>

            <div className="adding-window__main__form__line adding-window__main__form__line--normal">
              <label className="adding-window__main__form__line__label" htmlFor="carbs">Carbs: </label>
              <p 
                className="adding-window__main__form__line__input" 
                id="carbs">
                { state.productData.carbs }
              </p>
              <span className="adding-window__main__form__line__decoration">g</span>
            </div>

            <div className="adding-window__main__form__line adding-window__main__form__line--normal">
              <label className="adding-window__main__form__line__label" htmlFor="kcal">Calories: </label>
              <p 
                className="adding-window__main__form__line__input" 
                id="kcal">
                { state.productData.kcal }
              </p>
              <span className="adding-window__main__form__line__decoration">kcal</span>
            </div>


          </section>

          <section className="adding-window__main__form adding-window__main__form--buttons-section">


            <button className="adding-window__main__form__tertiary" type="button" onClick={ handleResetingForm }>Reset</button>
            
            <div className="adding-window__main__form__right">
              <button className="adding-window__main__form__secondary" type="button"  onClick={ props.handleEditingWindow }>Cancel</button>
              <input className="adding-window__main__form__primary" type="submit" value="Save"></input>
            </div>


          </section>

          </form>

      </main>

    </section>
  )
}