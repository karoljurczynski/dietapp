// IMPORTS

import React from 'react';
import './styles/main.css';
import { LogoContainer, MenuContainer, Quotation } from '../left/left';
import { TopCenterSection, MainContent } from '../center/center';
import { Gauge } from '../right/right';


// COMPONENTS

class LeftSection extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <aside className="left-section">
        <LogoContainer />
        <MenuContainer />
        <Quotation />
      </aside>

    );
  }
}

class CenterSection extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <main className="center-section">
        <TopCenterSection />
        <MainContent />
      </main>

    );
  }
}

class RightSection extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <aside className="right-section">
        <Gauge amount="500" type="kcal" percent="25" left="1500" isKcal={true} />
        <Gauge amount="100" type="proteins" percent="75" left="50"/>
        <Gauge amount="20" type="fats" percent="40" left="30"/>
        <Gauge amount="150" type="carbohydrates" percent="50" left="150"/>
      </aside>

    );
  }
}


// EXPORTS

export {LeftSection, CenterSection, RightSection };