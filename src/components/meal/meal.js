// IMPORTS

import React from 'react';
import './styles/meal.css';


// PRIMARY COMPONENTS 

class Meal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: true,
      proteinsSummary: 0,
      fatsSummary: 0,
      carbsSummary: 0,
      kcalSummary: 0,
      style: {
        left: '0px',
      }};
    this.isOpened = this.isOpened.bind(this);
    this.fromCenterMealSection = this.fromCenterMealSection.bind(this);
  }
  isOpened() {
    if(this.state.isClicked === false)
      this.setState({isClicked: true, style: {left: '0px'}});
    else
      this.setState({isClicked: false, style: {left: '-10px'}});
  }
  fromCenterMealSection(arg) {
    return arg;
  }
  render() {
    return (
      <div className="main__meal" style={this.state.style}>
        <TopMealSection 
          title={this.props.title}
          proteins={this.state.proteinsSummary}
          fats={this.state.fatsSummary}
          carbs={this.state.carbsSummary}
          kcal={this.state.kcalSummary}
          isClicked={this.isOpened}
          />
        <CenterMealSection 
          isOpened={this.state.isClicked}
          toMealSection={this.fromCenterMealSection}
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
        <MealTitle 
          title={this.props.title}
        />
        <NutritionStats 
          proteins={this.props.proteins}
          fats={this.props.fats}
          carbs={this.props.carbs}
          kcal={this.props.kcal}
        />
      </section>

    );
  }
}

class CenterMealSection extends React.Component {
  constructor(props) {
    super(props);
    this.changeDisplay = this.changeDisplay.bind(this);
    this.sendToMealSection = this.sendToMealSection.bind(this);
  }
  changeDisplay() {
    if(this.props.isOpened === true)
      return {display: "none"};
    else
      return {display: "flex"};
  }
  // SENDING DATA
  sendToMealSection(arg) {
    this.props.toMealSection(arg);
  }
  // SENDING DATA
  render() {
    return (

      <section className="main__meal__center" style={this.changeDisplay()}>
        <Product 
          productName={"Cottage cheese"}
          productWeight={200}
          proteins={40}
          fats={10}
          carbs={60}
          kcal={450}
          // SENDING DATA
          toCenterMealSection={this.sendToMealSection}
          // SENDING DATA
        />
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
        <Ingredient type="proteins" value={this.props.proteins} size="large"/>
        <Ingredient type="fats" value={this.props.fats} size="large"/>
        <Ingredient type="carbs" value={this.props.carbs} size="large"/>
        <Ingredient type="kcal" value={this.props.kcal} size="large"/>
      </section>

    );
  }
}

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.sendToCenterSection = this.sendToCenterSection.bind(this);
  }
  // SENDING DATA
  sendToCenterSection() {
    this.props.toCenterMealSection(this.props);
  }
  // SENDING DATA
  render() {
    // SENDING DATA
    this.sendToCenterSection();
    // SENDING DATA
    return (

      <section className="main__meal__center__product">
        <ProductInfo 
          productName={this.props.productName}
          productWeight={this.props.productWeight}
        />
        <ProductStats 
          proteins={this.props.proteins}
          fats={this.props.fats}
          carbs={this.props.carbs}
          kcal={this.props.kcal}
        />
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
        <ProductName 
          productName={this.props.productName}
        />
        <ProductWeight 
          productWeight={this.props.productWeight}  
        />
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
        <Ingredient type="proteins" value={this.props.proteins} size="small"/>
        <Ingredient type="fats" value={this.props.fats} size="small"/>
        <Ingredient type="carbs" value={this.props.carbs} size="small"/>
        <Ingredient type="kcal" value={this.props.kcal} size="small"/>
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

      <h4 className="main__meal__center__product__info__name">{this.props.productName}</h4>

    );
  }
}

class ProductWeight extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <p className="main__meal__center__product__info__weight">{this.props.productWeight} g</p>
      
    );
  }
}


// EXPORTS

export { Meal };