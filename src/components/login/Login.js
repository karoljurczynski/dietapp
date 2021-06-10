// IMPORTS

import { React, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';


import { db } from '../../index'; 
import { collection, addDoc, getDocs } from "firebase/firestore";

import { init, send } from 'emailjs-com'

init("user_f86s58XiiAbqNCi2GgiUB");


// VARIABLES

const warnings = {
  loginFail: "Incorrect login or password!",
  passwordsFail: "Passwords are not the same!",
  emailFail: "Incorrect e-mail!",
  minLengthFail: "Field is too short!",
  maxLengthFail: "Field is too long!",
  emptyFail: "Field is empty!",
  usernameExist: "Username exists in database!",
  emailExist: "E-mail exists in database!",
}

const initialState = {
  isSignUpWindow: false,
  isPasswordForgotten: false,
  isFormCompleted: false,
  warnings: {
    signUpUsername: "",
    signUpPassword: "",
    signUpConfirmPassword: "",
    signUpEmail: "",
    logInUsername: "",
    logInPassword: ""
  },
  formData: {
    signUpUsername: "",
    signUpPassword: "",
    signUpConfirmPassword: "",
    signUpEmail: "",
    logInUsername: "user",
    logInPassword: "password",
    forgotPasswordEmail: ""
  }
}

const ACTIONS = {
  NEGATE_SIGN_UP_WINDOW: 'negate-sign-up-window',
  NEGATE_IS_PASSWORD_FORGOTTEN: 'negate-is-password-forgotten',
  CHANGE_USER_DATA: 'change-user-data',
  CHANGE_IS_FORM_COMPLETED: 'changer-is-form-completed',
  SET_WARNING: 'set-warning',
  CLEAR_ALL_WARNINGS: 'clear-all-warnings'
}


// COMPONENT

export default function Login({ isLogout, setUserStatus, setUserId, setUserPersonalData, closeWindow }) {

  // HOOKS

  const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.NEGATE_SIGN_UP_WINDOW: {
        return { ...state, isSignUpWindow: !state.isSignUpWindow }
      }

      case ACTIONS.NEGATE_IS_PASSWORD_FORGOTTEN: {
        return { ...state, isPasswordForgotten: !state.isPasswordForgotten }
      }

      case ACTIONS.CHANGE_USER_DATA: {
        return { ...state, formData: { ...state.formData, [action.payload.key]: action.payload.value }};
      }

      case ACTIONS.CHANGE_IS_FORM_COMPLETED: {
        return { ...state, isFormCompleted: action.payload }
      }

      case ACTIONS.SET_WARNING: {
        return { ...state, warnings: { ...state.warnings, [action.payload.field]: action.payload.warning }}
      }

      case ACTIONS.CLEAR_ALL_WARNINGS: {
        return { ...state, warnings: initialState.warnings }
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

  // BLURING AND DISABLING POINTER EVENTS ON LOGIN WINDOW AFTER RESTORING PASSWORD WINDOW MOUNTING
  useEffect(() => {
    const loginWindow = document.querySelector(".window--login");
    if (loginWindow) {
      if (state.isPasswordForgotten) {
        loginWindow.style.filter = "blur(5px) opacity(40%) grayscale(100%)";
        loginWindow.style.pointerEvents = "none";
      }
      else {
        loginWindow.style.filter = "blur(0px) opacity(100%) grayscale(0%)";
        loginWindow.style.pointerEvents = "auto";
      }
    }

  }, [ state.isPasswordForgotten ]);

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

  const isFieldTooShort = (field) => {
    if (field.length < 3)
      return true;
    else
      return false;
  }

  const isFieldTooLong = (field) => {
    if (field.length > 32)
      return true;
    else
      return false;
  }

  const isFieldEmpty = (field) => {
    if (field.length === 0)
      return true;
    else
      return false;
  }

  const isEmailCorrect = (email) => {
    const regEx = /^[\w.-]{3,}@{1}[\w.-]{1,}[.]{1}\w{1,}/i;
    if (regEx.test(email))
      return true;
    else
      return false;
  }

  const handleFormTypeChanging = (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.NEGATE_SIGN_UP_WINDOW });
  }

  const handlePrimaryButton = (e) => {
    e.preventDefault();
    state.isSignUpWindow ? handleSignUpUser() : handleLoginUser();
  }

  const validateSignUpInputs = async () => {
    const formDataValues = [ 
      state.formData.signUpUsername, 
      state.formData.signUpPassword, 
      state.formData.signUpConfirmPassword, 
      state.formData.signUpEmail
    ];
    const formDataKeys = [ 
      "signUpUsername", 
      "signUpPassword",   
      "signUpConfirmPassword", 
      "signUpEmail"
    ];
    let isValidatedSuccessfully = true;

    formDataValues.forEach((formValue, index) => {
      if (!isFieldEmpty(formValue)) {
        if (!isFieldTooShort(formValue)) {
          if (!isFieldTooLong(formValue)) {
            dispatch({type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[index], warning: ''}});
          }
          else {
            dispatch({ type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[index], warning: warnings["maxLengthFail"]} });
            dispatch({type: ACTIONS.CHANGE_USER_DATA, payload: { key: formDataKeys[index], value: "" }});
            isValidatedSuccessfully = false;
          }
        }
        else {
          dispatch({ type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[index], warning: warnings["minLengthFail"]} });
          dispatch({type: ACTIONS.CHANGE_USER_DATA, payload: { key: formDataKeys[index], value: "" }});
          isValidatedSuccessfully = false;
        }
      }
      else {
        dispatch({ type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[index], warning: warnings["emptyFail"]} });
        dispatch({type: ACTIONS.CHANGE_USER_DATA, payload: { key: formDataKeys[index], value: "" }});
        isValidatedSuccessfully = false;
      }
      
      if (formDataKeys[index] === "signUpEmail") {
        if (!isEmailCorrect(formDataValues[index])) {
          dispatch({ type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[index], warning: warnings["emailFail"]} });
          dispatch({ type: ACTIONS.CHANGE_USER_DATA, payload: { key: formDataKeys[index], value: "" }});
          isValidatedSuccessfully = false;
        }
        else {
          dispatch({type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[index], warning: ''}});
        }
      }

      if (formDataKeys[index] === "signUpConfirmPassword") {
        if (state.formData.signUpConfirmPassword !== state.formData.signUpPassword) {
          dispatch({ type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[index], warning: warnings["passwordsFail"]} });
          dispatch({ type: ACTIONS.SET_WARNING, payload: {field: "signUpPassword", warning: warnings["passwordsFail"]} });
          dispatch({type: ACTIONS.CHANGE_USER_DATA, payload: { key: formDataKeys[index], value: "" }});
          dispatch({type: ACTIONS.CHANGE_USER_DATA, payload: { key: "signUpPassword", value: "" }});
          isValidatedSuccessfully = false;
        }
        else {
          dispatch({type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[index], warning: ''}});
        }
      }
    });

    if (await isEmailExist(formDataValues[3])) {
      console.log("exist");
      dispatch({ type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[3], warning: warnings["emailExist"]} });
      dispatch({ type: ACTIONS.CHANGE_USER_DATA, payload: { key: formDataKeys[3], value: "" }});
      isValidatedSuccessfully = false;
    }

    if (await isUsernameExist(formDataValues[0])) {
      console.log("exist");
      dispatch({ type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[0], warning: warnings["usernameExist"]} });
      dispatch({ type: ACTIONS.CHANGE_USER_DATA, payload: { key: formDataKeys[0], value: "" }});
      isValidatedSuccessfully = false;
    }

    if (isValidatedSuccessfully) {
      addUser();
      dispatch({ type: ACTIONS.NEGATE_SIGN_UP_WINDOW });
      dispatch({ type: ACTIONS.CLEAR_ALL_WARNINGS });
    }
  }

  const validateLogInInputs = async () => {
    const formDataValues = [ 
      state.formData.logInUsername, 
      state.formData.logInPassword, 
    ];
    const formDataKeys = [ 
      "logInUsername", 
      "logInPassword",   
    ];
    let isValidatedSuccessfully = true;

    formDataValues.forEach((formValue, index) => {
      if (!isFieldEmpty(formValue)) {
        if (!isFieldTooShort(formValue)) {
          if (!isFieldTooLong(formValue)) {
            dispatch({type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[index], warning: ''}});
          }
          else {
            dispatch({ type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[index], warning: warnings["maxLengthFail"]} });
            dispatch({type: ACTIONS.CHANGE_USER_DATA, payload: { key: formDataKeys[index], value: "" }});
            isValidatedSuccessfully = false;
          }
        }
        else {
          dispatch({ type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[index], warning: warnings["minLengthFail"]} });
          dispatch({type: ACTIONS.CHANGE_USER_DATA, payload: { key: formDataKeys[index], value: "" }});
          isValidatedSuccessfully = false;
        }
      }
      else {
        dispatch({ type: ACTIONS.SET_WARNING, payload: {field: formDataKeys[index], warning: warnings["emptyFail"]} });
        dispatch({type: ACTIONS.CHANGE_USER_DATA, payload: { key: formDataKeys[index], value: "" }});
        isValidatedSuccessfully = false;
      }
    });

    if (isValidatedSuccessfully)
      await logInUser();
  }

  const handleSignUpUser = async () => {
    validateSignUpInputs();
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
    validateLogInInputs(); 
  }

  const logInUser = async () => {
    let isLoggedSuccessfully = false;
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach(user => {
        if (user.data().username === state.formData.logInUsername) {
          if (user.data().password === state.formData.logInPassword) {
            isLoggedSuccessfully = true;
            setUserPersonalData(user.data().username, user.data().email, user.data().password);
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

  const handlePasswordRestoringWindow = (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.NEGATE_IS_PASSWORD_FORGOTTEN });
    clearFormData();
  }

  const isEmailExist = async (email) => {
    let isExist = false;
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach(user => {
        if (user.data().email === email) {
          isExist = true;
        }});
    }
    catch (e) {
      console.error(e);
    }

    return isExist;
  }

  const isUsernameExist = async (username) => {
    let isExist = false;
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach(user => {
        if (user.data().username === username) {
          isExist = true;
        }});
    }
    catch (e) {
      console.error(e);
    }

    return isExist;
  }

  const getUserPasswordFromEmail = async () => {
    let password = "";
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach(user => {
        if (user.data().email === state.formData.forgotPasswordEmail) {
          password = user.data().password;
        }});
    }
    catch (e) {
      console.error(e);
    }

    return password;
  }

  const handlePasswordRestoring = async (e) => {
    e.preventDefault();

    if (await isEmailExist(state.formData.forgotPasswordEmail)) {
      const templateParams = {
        user_email: state.formData.forgotPasswordEmail,
        user_password: await getUserPasswordFromEmail()
      };

      await send("service_vvs15qe", "template_698pq4k", templateParams)
      .then(res => { alert("Check your e-mail inbox.") })
      .catch(err => { alert("Error with email sending, check console."); console.error(err) })
    }
    else {
      alert("Account with entered e-mail does not exist!");
    }
    
    clearFormData();
    dispatch({ type: ACTIONS.NEGATE_IS_PASSWORD_FORGOTTEN });
  }

  const handleOnChange = (e) => {
    if (e.target.id !== "confirmSignUpPassword")
      dispatch({type: ACTIONS.CHANGE_USER_DATA, payload: { key: e.target.id, value: e.target.value }});
  }

  
  // RETURN

  return ReactDOM.createPortal (
    <>
    <div className="window__closer" onClick={ handleCancel }></div>
    { state.isPasswordForgotten 
    ? <div className="window window--forgotpassword">

        <header className="window__header">
          <h2 className="window__header__heading">Forgotten password</h2>
          <button
            className="window__header__back-button"
            type="button"
            onClick={ handlePasswordRestoringWindow }
            style={{ zIndex: 11 }}><FaChevronCircleLeft />
          </button>
          <button 
            className="window__header__add-button"
            type="button"
            onClick={ handlePasswordRestoring }
            style={{ zIndex: 11 }}><FaChevronCircleRight />
          </button>
        </header>

        <main className="window__main">
          <span className="window__main__input-line">
            <label className="window__main__input-line__label" htmlFor="forgotPasswordEmail">E-mail</label>
            <input 
              className="window__main__input-line__input" 
              type="email" 
              id="forgotPasswordEmail" 
              value={ state.formData.forgotPasswordEmail } 
              onChange={ handleOnChange } 
              placeholder={ state.warnings["forgotPasswordEmail"] ? state.warnings["forgotPasswordEmail"] : null }>
            </input>
          </span>
        </main>

        <section className="window__bottom">
          <button className="window__bottom__secondary-button" type="button" onClick={ handlePasswordRestoringWindow }>Cancel</button>
          <button 
            className={ state.formData.forgotPasswordEmail ? "window__bottom__primary-button" : "window__bottom__primary-button window__bottom__primary-button--disabled"} 
            type="submit" 
            disabled={ state.formData.forgotPasswordEmail ? false : true } 
            onClick={ state.formData.forgotPasswordEmail ? handlePasswordRestoring : null }>
            Send
          </button>
        </section>
      </div>
    : null }

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
                    placeholder={ state.warnings["signUpUsername" ] ? state.warnings["signUpUsername" ] : null }>
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
                    placeholder={ state.warnings["signUpEmail"] ? state.warnings["signUpEmail"] : null }>
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
                    placeholder={ state.warnings["signUpPassword"] ? state.warnings["signUpPassword"] : null }>
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
                    placeholder={ state.warnings["signUpConfirmPassword"] ? state.warnings["signUpConfirmPassword"] : null }>
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
                    placeholder={ state.warnings["logInUsername"] ? state.warnings["logInUsername"] : null }>
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
                    placeholder={ state.warnings["logInPassword"] ? state.warnings["logInPassword"] : null }>
                  </input>
                  <a className="window__main__input-line__link" href="" onClick={ handlePasswordRestoringWindow }>Forgot your password?</a>
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