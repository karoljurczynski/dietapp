// IMPORTS

import React, { useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import './styles/meal.css';


// PRIMARY COMPONENTS 

class Meal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: true,
      style: {
        left: '0px',
        height: ''
      }};
    this.isOpened = this.isOpened.bind(this);
  }
  isOpened() {
    if(this.state.isClicked === false)
      this.setState({isClicked: true, style: {left: '0px', height: ''}});
    else
      this.setState({isClicked: false, style: {left: '-10px', height: ''}});
  }
  render() {
    return (

      <div className="main__meal" style={this.state.style}>
        <TopMealSection 
          title={this.props.title}
          proteins={this.props.proteins}
          fats={this.props.fats}
          carbs={this.props.carbs}
          kcal={this.props.kcal}
          isClicked={this.isOpened}
          />
        <CenterMealSection 
          productName={this.props.productName}
          productWeight={this.props.productWeight}
          proteins={this.props.proteins}
          fats={this.props.fats}
          carbs={this.props.carbs}
          kcal={this.props.kcal}
          isOpened={this.state.isClicked}
        />
        <BottomMealSection 
          isOpened={this.state.isClicked}
        />
      </div>

    );
  }
}


// SECONDARY COMPONENTS

class TopMealSection extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }
  handleOnClick() {
    if(this.props.isClicked === true) {
      this.props.isClicked(false);
    }
    else {
      this.props.isClicked(true);
    }
  }
  render() {
    return (

      <section 
        className="main__meal__top" 
        onClick={this.handleOnClick}>
        <MealTitle title={this.props.title}/>
        <NutritionStats />
      </section>

    );
  }
}

class CenterMealSection extends React.Component {
  constructor(props) {
    super(props);
    this.changeDisplay = this.changeDisplay.bind(this);
  }
  changeDisplay() {
    if(this.props.isOpened === true)
      return {display: "none"};
    else
      return {display: "flex"};
  }
  
  render() {
    return (

      <section className="main__meal__center" style={this.changeDisplay()}>
        <Product />
        <Product />
      </section>

    );
  }
}

class BottomMealSection extends React.Component {
  constructor(props) {
    super(props);
  }
  changeDisplay() {
    if(this.props.isOpened === true)
      return {display: "none"};
    else
      return {display: "flex"};
  }
  render() {
    return (

      <section className="main__meal__bottom" style={this.changeDisplay()}>
        <ButtonsSection />
      </section>

    );
  }
}


// TERTIARY COMPONENTS

class MealTitle extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <h4 className="main__meal__top__title">{this.props.title}</h4>

    );
  }
}

class NutritionStats extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="main__meal__top__nutrition-stats">
        <Ingredient type="proteins" value="80" size="large"/>
        <Ingredient type="fats" value="26" size="large"/>
        <Ingredient type="carbs" value="12" size="large"/>
        <Ingredient type="kcal" value="252" size="large"/>
      </section>

    );
  }
}

class Product extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="main__meal__center__product">
        <ProductInfo />
        <ProductStats />
      </section>

    );
  }
}

class ButtonsSection extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="main__meal__bottom__buttons-section">
        <Button type="remove" name="Remove" title="Remove" />
        <Button type="add" name="Add" title="Remove" />
      </section>

    );
  }
}

class Ingredient extends React.Component {
  constructor(props) {
    super(props);
    this.className = '';
    this.unit = '';
  }
  isKcal() {
    if (this.props.type === "kcal") {
      this.unit = "kcal";
      return true;
    } 
    else {
      this.unit = "g";
      return false;
    }
  }
  isSmall() {
    if (this.props.size === "small") {
      this.isKcal() 
      ? this.className = "main__meal__center__product__stats__ingredient main__meal__center__product__stats__ingredient--kcal"
      : this.className = "main__meal__center__product__stats__ingredient";
    }
    else {
      this.isKcal() 
      ? this.className = "main__meal__top__nutrition-stats__ingredient main__meal__top__nutrition-stats__ingredient--kcal"
      : this.className = "main__meal__top__nutrition-stats__ingredient";
    }
  }
  render() {
    this.isKcal();
    this.isSmall();
    return (

      <h4 className={this.className}>{`${this.props.value} ${this.unit}`}</h4>

    );
  }
}

class ProductInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="main__meal__center__product__info">
        <ProductName />
        <ProductWeight />
      </section>

    );
  }
}

class ProductStats extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="main__meal__center__product__stats">
        <Ingredient type="proteins" value="80" size="small"/>
        <Ingredient type="fats" value="26" size="small"/>
        <Ingredient type="carbs" value="12" size="small"/>
        <Ingredient type="kcal" value="252" size="small"/>
      </section>

    );
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.className = '';
  }
  isRemovingButton() {
    if (this.props.type === "remove")
      this.className = "main__meal__bottom__buttons-section__remove-button";
    else
      this.className = "main__meal__bottom__buttons-section__add-button";
  }
  render() {
    this.isRemovingButton();
    return (

      <button className={this.className} title={this.props.title}>{this.props.name}</button>

    );
  }
}

class ProductName extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <h4 className="main__meal__center__product__info__name">Jaja kurze</h4>

    );
  }
}

class ProductWeight extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <p className="main__meal__center__product__info__weight">{80} g</p>
      
    );
  }
}


// EXPORTS

export { Meal };