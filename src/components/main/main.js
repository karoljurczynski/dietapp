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
        <Gauge />
        <Gauge />
        <Gauge />
        <Gauge />
      </aside>

    );
  }
}


// EXPORTS

export {LeftSection, CenterSection, RightSection };