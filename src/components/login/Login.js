// IMPORTS

import { React, useReducer } from 'react';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';


// VARIABLES

const initialState = {
  isSignUpWindow: false
}

const ACTIONS = {
  NEGATE_SIGN_UP_WINDOW: 'negate-sign-up-window'
}


// COMPONENT

export default function Login({ isLogout, setUserStatus, disableLoginWindows }) {

  // HOOKS

  const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.NEGATE_SIGN_UP_WINDOW: {
        return { ...state, isSignUpWindow: !state.isSignUpWindow }
      }
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);


  // FUNCTIONS

  const handleFormTypeChanging = (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.NEGATE_SIGN_UP_WINDOW });
  }

  const handleTryAsGuest = (e) => {
    e.preventDefault();
    setUserStatus("Guest");
    disableLoginWindows();
  }

  const handleLoginUser = (e) => {
    e.preventDefault();
    setUserStatus("Logged");
    disableLoginWindows();
  }

  const handleLogoutUser = (e) => {
    e.preventDefault();
    setUserStatus("Log in");
    disableLoginWindows();
  }

  const handleCancel = (e) => {
    e.preventDefault();
    disableLoginWindows();
  }

  const handleForgottenPassword = (e) => {
    e.preventDefault();
  }


  // RETURN

  return (
    <>
    { isLogout 
      ? <div className="window window--logout">
          <header className="window__header">
            <h2 className="window__header__heading">Log out?</h2>

            <button 
              className="window__header__back-button"
              type="button"
              onClick={ handleLoginUser}
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
            <button className="window__bottom__secondary-button" type="button" onClick={ handleLoginUser }>Cancel</button>
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
                  <label className="window__main__input-line__label" htmlFor="login">Login</label>
                  <input className="window__main__input-line__input" type="text" id="login" placeholder="Type anything or try as guest"></input>
                </span>

                <span className="window__main__input-line">
                  <label className="window__main__input-line__label" htmlFor="email">Email</label>
                  <input className="window__main__input-line__input" type="email" id="email" placeholder="Type anything or try as guest"></input>
                </span>

                <span className="window__main__input-line">
                  <label className="window__main__input-line__label" htmlFor="password">Password</label>
                  <input className="window__main__input-line__input" type="password" id="password" placeholder="Type anything or try as guest"></input>
                </span>

                <span className="window__main__input-line">
                  <label className="window__main__input-line__label" htmlFor="confirmPassword">Confirm Password</label>
                  <input className="window__main__input-line__input" type="password" id="confirmPassword" placeholder="Type anything or try as guest"></input>
                </span>

                <section className="window__main__login-options">
                  <span className="window__main__login-options__line">{`Already had an account? `}
                    <a className="window__main__login-options__line__link" onClick={ handleFormTypeChanging } href="">Log in</a>
                  </span>

                  <span className="window__main__login-options__line">{`or `}
                    <a className="window__main__login-options__line__link" onClick={ handleTryAsGuest } href="">Try as guest</a>
                  </span>
                </section>

                <section className="window__main__login-options">
                  <span className="window__main__login-options__line" style={{ color: "red" }}>Work in progress</span>
                </section>

              </main>

            : <main className="window__main">

                <span className="window__main__input-line">
                  <label className="window__main__input-line__label" htmlFor="login">Login</label>
                  <input className="window__main__input-line__input" type="text" id="login" placeholder="Type anything or try as guest"></input>
                </span>

                <span className="window__main__input-line">
                  <label className="window__main__input-line__label" htmlFor="password">Password</label>
                  <input className="window__main__input-line__input" type="password" id="password" placeholder="Type anything or try as guest"></input>
                  <a className="window__main__input-line__link" href="" onClick={ handleForgottenPassword }>Forgot your password?</a>
                </span>

                <section className="window__main__login-options">
                  <span className="window__main__login-options__line">{`Don't have an account? `}
                    <a className="window__main__login-options__line__link" onClick={ handleFormTypeChanging } href="">Sign up</a>
                  </span>

                  <span className="window__main__login-options__line">{`or `}
                    <a className="window__main__login-options__line__link" onClick={ handleTryAsGuest } href="">Try as guest</a>
                  </span>
                </section>

                <section className="window__main__login-options">
                  <span className="window__main__login-options__line" style={{ color: "red" }}>Work in progress</span>
                </section>

              </main>
          }
          
          <section className="window__bottom">
            <button className="window__bottom__secondary-button" type="button" onClick={ handleCancel }>Cancel</button>
            <button className="window__bottom__primary-button" type="submit" onClick={ handleLoginUser }>{ state.isSignUpWindow ? "Sign up" : "Log in"}</button>
          </section>
        </div>
    }
    </>
  )
}