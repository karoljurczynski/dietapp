// IMPORTS

import { React, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';

import { db } from '../../index'; 
import { collection, addDoc, getDocs } from "firebase/firestore";


// VARIABLES

const initialState = {
  isSignUpWindow: false,
  isFormCompleted: false,
  formData: {
    signUpUsername: "",
    signUpPassword: "",
    signUpConfirmPassword: "",
    signUpEmail: "",
    logInUsername: "",
    logInPassword: ""
  }
}

const ACTIONS = {
  NEGATE_SIGN_UP_WINDOW: 'negate-sign-up-window',
  CHANGE_USER_DATA: 'change-user-data',
  CHANGE_IS_FORM_COMPLETED: 'changer-is-form-completed'
}


// COMPONENT

export default function Login({ isLogout, setUserStatus, setUserId, closeWindow }) {

  // HOOKS

  const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.NEGATE_SIGN_UP_WINDOW: {
        return { ...state, isSignUpWindow: !state.isSignUpWindow }
      }

      case ACTIONS.CHANGE_USER_DATA: {
        return { ...state, formData: { ...state.formData, [action.payload.key]: action.payload.value }};
      }

      case ACTIONS.CHANGE_IS_FORM_COMPLETED: {
        return { ...state, isFormCompleted: action.payload }
      }
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);


  // EFFECTS

  // BLURING AND DISABLING POINTER EVENTS ON BACKGROUND AFTER MOUNTING
  useEffect(() => {
    const wrapper = document.querySelector(".wrapper");
    const rootElement = document.querySelector("#root");
    const hamburger = document.querySelector(".left-section__hamburger");
    wrapper.style.filter = "blur(5px) opacity(40%) grayscale(100%)";
    wrapper.style.pointerEvents = "none";
    rootElement.style.zIndex = 97;
    hamburger.style.display = "none";
    
    return (() => {
      wrapper.style.filter = "blur(0px) opacity(100%) grayscale(0%)";
      wrapper.style.pointerEvents = "auto";
      rootElement.style.zIndex = 99;
      if (window.innerWidth < 769)
        hamburger.style.display = "flex";
    })

  }, []);

  // CHECKS IF FORM IS COMPLETED
  useEffect(() => {
    const signUpCondition = state.formData.signUpUsername && state.formData.signUpPassword && state.formData.signUpConfirmPassword && state.formData.signUpEmail;
    const logInCondition = state.formData.logInUsername && state.formData.logInPassword;

    if (state.isSignUpWindow) {
      if (signUpCondition)
        dispatch({ type: ACTIONS.CHANGE_IS_FORM_COMPLETED, payload: true });
      else
        dispatch({ type: ACTIONS.CHANGE_IS_FORM_COMPLETED, payload: false });
    }

    else {
      if (logInCondition)
        dispatch({ type: ACTIONS.CHANGE_IS_FORM_COMPLETED, payload: true });
      else
        dispatch({ type: ACTIONS.CHANGE_IS_FORM_COMPLETED, payload: false });
    }
     
  }, [ state.formData ]);


  // FUNCTIONS

  const handleFormTypeChanging = (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.NEGATE_SIGN_UP_WINDOW });
  }

  const handlePrimaryButton = (e) => {
    e.preventDefault();
    state.isSignUpWindow ? handleSignUpUser() : handleLoginUser();
  }

  const handleSignUpUser = async () => {
    const isPasswordsCorrect = state.formData.signUpConfirmPassword === state.formData.signUpPassword;

    if (isPasswordsCorrect) {
      addUser();
      dispatch({ type: ACTIONS.NEGATE_SIGN_UP_WINDOW });
    }

    else
      clearFormData();
  }

  const addUser = async () => {
    try {
      await addDoc(collection(db, "users"), {
        username: state.formData.signUpUsername,
        password: state.formData.signUpPassword,
        email: state.formData.signUpEmail
      });
      
    } 
    catch (e) {
      console.error(e);
    }
  }

  const handleLoginUser = async () => {
    await logInUser();  
  }

  const logInUser = async () => {
    let isLoggedSuccessfully = false;
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach(user => {
        if (user.data().username === state.formData.logInUsername) {
          if (user.data().password === state.formData.logInPassword) {
            isLoggedSuccessfully = true;
            setUserId(user.id);
            setUserStatus("Logged");
            closeWindow();
          }
          else {
            isLoggedSuccessfully = false;
            clearFormData();
          }   
        }

        else {
          isLoggedSuccessfully = false;
          clearFormData(); 
        }
      });
    }

    catch (e) {
      console.error(e);
    }
    return isLoggedSuccessfully;
  }

  const handleLogoutUser = (e) => {
    e.preventDefault();
    setUserStatus("Log in");
    setUserId(0);
    closeWindow();
  }

  const handleCancel = (e) => {
    e.preventDefault();
    closeWindow();
  }
  
  const clearFormData = () => {
    Object.keys(state.formData).forEach(key => {
      dispatch({type: ACTIONS.CHANGE_USER_DATA, payload: { key: [key], value: "" }});
    });
  }

  const handleOnChange = (e) => {
    if (e.target.id !== "confirmSignUpPassword")
      dispatch({type: ACTIONS.CHANGE_USER_DATA, payload: { key: e.target.id, value: e.target.value }});
    /*switch(e.target.id) {
      case "signUpUsername": {
        dispatch({type: ACTIONS.CHANGE_USER_DATA, payload: { key: e.target.id, value: e.target.value }});
        break;
      }

      case "signUpPassword": {
        break;
        
      }
      case "signUpEmail": {
        
      }
      case "logInUsername": {
        
      }
      case "logInPassword": {
        
      }
      case "logInEmail": {
        
      }
    }*/
  }

  const handleForgottenPassword = (e) => {
    e.preventDefault();
  }

  // RETURN

  return ReactDOM.createPortal (
    <>
    { isLogout 
      ? <div className="window window--logout">
          <header className="window__header">
            <h2 className="window__header__heading">Log out?</h2>

            <button 
              className="window__header__back-button"
              type="button"
              onClick={ handleCancel }
              style={{ zIndex: 11 }}><FaChevronCircleLeft />
            </button>

            <button 
              className="window__header__add-button"
              type="button"
              onClick={ handleLogoutUser }
              style={{ zIndex: 11 }}><FaChevronCircleRight />
            </button>
          </header>

          <main className="window__main">
            <h3 className="window__main__section__title">Confirm</h3>
            <p className="window__main__message">Are you sure you want to log out?</p>
          </main>

          <section className="window__bottom">
            <button className="window__bottom__secondary-button" type="button" onClick={ handleCancel }>Cancel</button>
            <button className="window__bottom__primary-button" type="button" onClick={ handleLogoutUser }>Log out</button>
          </section>
        </div>

      : <div className="window window--login">
          <header className="window__header">
            <h2 className="window__header__heading">{ state.isSignUpWindow ? "Sign up" : "Log in"}</h2>
            
            <button 
              className="window__header__back-button"
              type="button"
              onClick={ handleCancel }
              style={{ zIndex: 11 }}><FaChevronCircleLeft />
            </button>

            <button 
              className="window__header__add-button"
              type="submit"
              onClick={ handleLoginUser }
              style={{ zIndex: 11 }}><FaChevronCircleRight />
            </button>
          </header>

          { state.isSignUpWindow
            ? <main className="window__main">

                <span className="window__main__input-line">
                  <label className="window__main__input-line__label" htmlFor="signUpUsername">Username</label>
                  <input 
                    className="window__main__input-line__input" 
                    type="text" 
                    id="signUpUsername" 
                    value={ state.formData.signUpUsername }
                    onChange={ handleOnChange } 
                    placeholder="">
                  </input>
                </span>

                <span className="window__main__input-line">
                  <label className="window__main__input-line__label" htmlFor="signUpEmail">Email</label>
                  <input 
                    className="window__main__input-line__input" 
                    type="email" 
                    id="signUpEmail" 
                    value={ state.formData.signUpEmail } 
                    onChange={ handleOnChange } 
                    placeholder="">
                  </input>
                </span>

                <span className="window__main__input-line">
                  <label className="window__main__input-line__label" htmlFor="signUpPassword">Password</label>
                  <input 
                    className="window__main__input-line__input" 
                    type="password" 
                    id="signUpPassword" 
                    value={ state.formData.signUpPassword } 
                    onChange={ handleOnChange } 
                    placeholder="">
                  </input>
                </span>

                <span className="window__main__input-line">
                  <label className="window__main__input-line__label" htmlFor="signUpConfirmPassword">Confirm Password</label>
                  <input 
                    className="window__main__input-line__input" 
                    type="password" 
                    id="signUpConfirmPassword" 
                    value={ state.formData.signUpConfirmPassword }
                    onChange={ handleOnChange } 
                    placeholder="">
                  </input>
                </span>

                <section className="window__main__login-options">
                  <span className="window__main__login-options__line">{`Already had an account? `}
                  </span>
                  <span className="window__main__login-options__line">
                    <a className="window__main__login-options__line__link" onClick={ handleFormTypeChanging } href="">Log in</a>
                  </span>
                </section>
              </main>

            : <main className="window__main">

                <span className="window__main__input-line">
                  <label className="window__main__input-line__label" htmlFor="logInUsername">Username</label>
                  <input 
                    className="window__main__input-line__input" 
                    type="text" 
                    id="logInUsername" 
                    value={ state.formData.logInUsername } 
                    onChange={ handleOnChange } 
                    placeholder="">
                  </input>
                </span>

                <span className="window__main__input-line">
                  <label className="window__main__input-line__label" htmlFor="logInPassword">Password</label>
                  <input 
                    className="window__main__input-line__input" 
                    type="password" 
                    id="logInPassword" 
                    value={ state.formData.logInPassword } 
                    onChange={ handleOnChange } 
                    placeholder="">
                  </input>
                  <a className="window__main__input-line__link" href="" onClick={ handleForgottenPassword }>Forgot your password?</a>
                </span>

                <section className="window__main__login-options">
                  <span className="window__main__login-options__line">{`Don't have an account? `}
                  </span>
                  <span className="window__main__login-options__line">
                    <a className="window__main__login-options__line__link" onClick={ handleFormTypeChanging } href="">Sign up</a>
                  </span>
                </section>
              </main>
          }
          
          <section className="window__bottom">
            <button className="window__bottom__secondary-button" type="button" onClick={ handleCancel }>Cancel</button>
            <button 
              className={ state.isFormCompleted ? "window__bottom__primary-button" : "window__bottom__primary-button window__bottom__primary-button--disabled"} 
              type="submit" 
              disabled={ state.isFormCompleted ? false : true } 
              onClick={ state.isFormCompleted ? handlePrimaryButton : null }>
              { state.isSignUpWindow ? "Sign up" : "Log in"}
            </button>
          </section>
        </div>
    }
    </>,
    document.getElementById('portal')
  )
}