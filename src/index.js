// IMPORTS

import React from 'react';
import ReactDOM from 'react-dom';

import { Logo, Title, MenuItem, Quotation } from './components/left/left';
import DateChanger from './components/center/DateChanger';
import Meal from './components/meal/Meal';
import Gauge from './components/right/Gauge';

import './styles/index/index.css';
import './components/left/styles/left.css';
import './components/center/styles/center.css';
import './components/right/styles/right.css';


// COMPONENTS

function App() {

  return (
    <div className="wrapper">


      <aside className="left-section">

        <header className="left-section__logo-container">
          <Logo />
          <Title />
        </header>

        <ul className="left-section__menu-container">
          <MenuItem value="Log in" href="#" isActive={true} />
          <MenuItem value="Settings" href="#" isActive={false} />
          <MenuItem value="Training" href="#" isActive={false} />
          <MenuItem value="About" href="#" isActive={false} />
        </ul>

        <h2 className="left-section__quotation-container">
          <Quotation />
        </h2>
        
      </aside>


      <main className="center-section">


        <section className="center-section__top">
        
          <h3 className="center-section__top__title">Dashboard</h3>
          <DateChanger />

        </section>

      
        <section className="center-section__meals">

          <Meal name="Breakfast"/>
          <Meal name="II Breakfast"/>
          <Meal name="Lunch"/>
          <Meal name="Snack"/>
          <Meal name="Dinner"/>

        </section>


      </main>


      <aside className="right-section">

        <Gauge amount="500" type="kcal" percent="25" left="1500" isKcal={true} />
        <Gauge amount="100" type="proteins" percent="75" left="50"/>
        <Gauge amount="20" type="fats" percent="40" left="30"/>
        <Gauge amount="150" type="carbohydrates" percent="50" left="150"/>

      </aside>


    </div>
  )
}


// RENDERING

ReactDOM.render(<App />, document.querySelector("#root"));