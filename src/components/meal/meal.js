// IMPORTS

import React from 'react';
import './styles/meal.css';


// PRIMARY COMPONENTS 

class Meal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <div className="center-section__main__meal">
        <TopMealSection title={this.props.title}/>
        <CenterMealSection />
        <BottomMealSection />
      </div>

    );
  }
}


// SECONDARY COMPONENTS

class TopMealSection extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="center-section__main__meal__top">
        <MealTitle title={this.props.title}/>
        <NutritionStats />
      </section>

    );
  }
}

class CenterMealSection extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="center-section__main__meal__center">
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
  render() {
    return (

      <section className="center-section__main__meal__bottom">
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

      <h4 className="center-section__main__meal__top__title">{this.props.title}</h4>

    );
  }
}

class NutritionStats extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <section className="center-section__main__meal__top__nutrition-stats">
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

      <section className="center-section__main__meal__center__product">
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

      <section className="center-section__main__meal__bottom__buttons-section">
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
    if (this.props.type === "kcal")
      this.unit = "kcal";
    else {
      this.unit = "g";
    }
  }
  isSmall() {
    if (this.props.size === "small") {
      this.isKcal() 
      ? this.className = "center-section__main__meal__center__product__stats_ingredient center-section__main__meal__center__product__stats_ingredient--kcal"
      : this.className = "center-section__main__meal__center__product__stats_ingredient";
    }
    else {
      this.isKcal() 
      ? this.className = "center-section__main__meal__top__nutrition-stats__ingredient center-section__main__meal__top__nutrition-stats__ingredient--kcal"
      : this.className = "center-section__main__meal__top__nutrition-stats__ingredient";
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

      <section className="center-section__main__meal__center__product__info">
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

      <section className="center-section__main__meal__center__product__stats">
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
      this.className = "center-section__main__meal__bottom__buttons-section__remove-button";
    else
      this.className = "center-section__main__meal__bottom__buttons-section__add-button";
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

      <h4 className="center-section__main__meal__center__product__info__name">Jaja kurze</h4>

    );
  }
}

class ProductWeight extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <p className="center-section__main__meal__center__product__info__weight">{80}g</p>
      
    );
  }
}


// EXPORTS

export { Meal };