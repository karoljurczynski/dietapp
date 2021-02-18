// IMPORTS

import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './styles/index.css';

import { LeftSection, CenterSection, RightSection } from './components/main/main';


// COMPONENTS

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <div className="wrapper">
        <LeftSection />
        <CenterSection />
        <RightSection />
      </div>

    );
  }
}


// RENDERING

render(<App />, document.querySelector("#root"));