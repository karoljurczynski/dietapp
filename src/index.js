// IMPORTS

import { React, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { Logo, Title, MenuItem, Quotation } from './components/left/left';
import DateChanger from './components/center/DateChanger';
import Meal from './components/meal/Meal';
import Gauge from './components/right/Gauge';
import Exercise from './components/exercise/Exercise';

import './styles/index/index.css';
import './components/left/styles/left.css';
import './components/center/styles/center.css';
import './components/right/styles/right.css';


// GLOBALS

const MENU_CATEGORIES= ["Log in", "Nutrition", "Training", "Settings", "About"];
const ACTIONS = {
  UPDATE_MEALS_INGREDIENTS_SUMMARY: 'update-meals-ingredients-summary',
  UPDATE_DAILY_INGREDIENTS_SUMMARY: 'update-daily-ingredients-summary',
  COUNT_GAUGES_DATA: 'count-gauges-data',
  CHANGE_DATE: 'change-date',
  CHANGE_PAGE_TITLE: 'change-page-title',
  CHANGE_SETTINGS_DATA: 'change-settings-data',
  BACKUP_OLD_SETTINGS: 'backup-old-settings',
  RESTORE_OLD_SETTINGS: 'restore-old-settings',
  LOAD_SETTINGS: 'load-settings',
  SET_CLEAR_ALL_PRODUCTS: 'set-clear-all-products'
}


// FUNCTIONS

const countPercentOfEatenIngredient = (eatenAmount, maxAmount) => {
  if (Number.isNaN((Math.round(eatenAmount / maxAmount * 100))))
    return 0;
  else
   return Math.round(eatenAmount / maxAmount * 100);
}

const countAmountOfIngredientLeft = (eatenAmount, maxAmount) => {
  if (eatenAmount >= maxAmount)
    return 0;
  else
    return maxAmount - eatenAmount;
}


// COMPONENTS

function App() {

  // EFFECT WHICH CHECKS IS SETTINGS ARE SAVED IN LOCAL STORAGE
  useEffect(() => {

    if (Object.keys(localStorage).length !== 0)
      dispatch({ type: ACTIONS.LOAD_SETTINGS });   
    else
      saveSettingsToLocalStorage(); 

    backupSettings();
  }, []);

  const reducer = (state, action) => {
    switch (action.type) {

      case ACTIONS.UPDATE_MEALS_INGREDIENTS_SUMMARY: {
        const newMealsIngredientsSummary = [...state.mealsIngredientsSummary];

        newMealsIngredientsSummary[action.payload.mealId] = {
                                                              proteins: action.payload.data.proteins,
                                                              fats: action.payload.data.fats, 
                                                              carbs: action.payload.data.carbs, 
                                                              kcal: action.payload.data.kcal };

        return {...state, mealsIngredientsSummary: newMealsIngredientsSummary};                                                                 
      }

      case ACTIONS.UPDATE_DAILY_INGREDIENTS_SUMMARY: {
        let dailyIngredientsSum = { proteins: 0, fats: 0, carbs: 0, kcal: 0 };
        let mealsIngredientsSum = { proteins: 0, fats: 0, carbs: 0, kcal: 0 };

        state.mealsIngredientsSummary.forEach(meal => {
          mealsIngredientsSum = {
                                  proteins: meal.proteins,
                                  fats:     meal.fats,
                                  carbs:    meal.carbs,
                                  kcal:     meal.kcal };

          dailyIngredientsSum = {
                                  proteins: dailyIngredientsSum.proteins + mealsIngredientsSum.proteins,
                                  fats:     dailyIngredientsSum.fats     + mealsIngredientsSum.fats,
                                  carbs:    dailyIngredientsSum.carbs    + mealsIngredientsSum.carbs,
                                  kcal:     dailyIngredientsSum.kcal     + mealsIngredientsSum.kcal };

          mealsIngredientsSum = { proteins: 0,
                                  fats: 0,
                                  carbs: 0,
                                  kcalS: 0 };
        });

        return {...state, dailyIngredientsSummary: dailyIngredientsSum };
      }

      case ACTIONS.COUNT_GAUGES_DATA: {
        const ingredient = action.payload.typeOfIngredient;

        return {...state, gaugesData: {...state.gaugesData, 
          [ingredient]: { 
            eaten: state.dailyIngredientsSummary[ingredient], 
            left: countAmountOfIngredientLeft(state.dailyIngredientsSummary[ingredient], state.settingsData.nutrition.dailyDemand[ingredient]), 
            max: state.settingsData.nutrition.dailyDemand[ingredient], 
            percent: countPercentOfEatenIngredient(state.dailyIngredientsSummary[ingredient], state.settingsData.nutrition.dailyDemand[ingredient]) }
          }
        }
      }

      case ACTIONS.CHANGE_DATE: {
        return {...state, dateIds: { dayId: action.payload.currentDay,  
                                     monthId: action.payload.currentMonth,
                                     yearId: action.payload.currentYear }};
      }

      case ACTIONS.CHANGE_PAGE_TITLE: {
        return {...state, pageTitle: action.payload};
      }

      case ACTIONS.BACKUP_OLD_SETTINGS: {
        return {...state, oldSettingsData: state.settingsData};
      }

      case ACTIONS.RESTORE_OLD_SETTINGS: {
        return {...state, settingsData: state.oldSettingsData};
      }

      case ACTIONS.CHANGE_SETTINGS_DATA: {
        switch (action.payload.key) {

          case 'editMealName': {
            return {...state, 
              settingsData: { ...state.settingsData, 
              nutrition: {...state.settingsData.nutrition,
              namesOfMeals: {...state.settingsData.nutrition.namesOfMeals, [action.payload.index]: action.payload.value }}}
            };
          };

          case 'setMealsNumber': {
            return {...state, 
              settingsData: { ...state.settingsData, 
              nutrition: {...state.settingsData.nutrition,
              numberOfMeals: action.payload.value }}
            };
          };

          default: return {...state, 
                           settingsData: { ...state.settingsData, 
                           nutrition: {...state.settingsData.nutrition, 
                           dailyDemand: {...state.settingsData.nutrition.dailyDemand, 
                           [action.payload.key]: action.payload.value }}}};
        }
      }

      case ACTIONS.LOAD_SETTINGS: {
        let newSettings = JSON.parse(localStorage.getItem("settings"));
        return {...state, settingsData: newSettings }
      }

      case ACTIONS.SET_CLEAR_ALL_PRODUCTS: {
        return { ...state, clearAllProducts: action.payload };
      }

      default: return console.error(`Unknown action type: ${action.type}`);
    }
  }

  const initialState = {
    dateIds: { dayId: 0, monthId: 0, yearId: 0 },
    pageTitle: 'Dashboard',
    mealsIngredientsSummary: [],
    dailyIngredientsSummary: { kcal: 0, proteins: 0, fats: 0, carbs: 0 },
    gaugesData: {
      kcal: { eaten: 0, left: 0, max: 0, percent: 0 },
      proteins: { eaten: 0, left: 0, max: 0, percent: 0 },
      fats: { eaten: 0, left: 0, max: 0, percent: 0 },
      carbs: { eaten: 0, left: 0, max: 0, percent: 0 }
    },
    settingsData: {
      main: {

      },

      nutrition: {
        dailyDemand: { kcal: 2000, proteins: 120, fats: 55, carbs: 240 },
        namesOfMeals: { 0: "Breakfast", 1: "II Breakfast", 2: "Lunch", 3: "Snack", 4: "Dinner", 5: "", 6: "", 7: "", 8: "", 9: "" },
        numberOfMeals: 5
      },

      training: {
        exercises: [
          { id: 0,
            name: "Bench Press",
            description: `The bench press is an upper-body weight training exercise in which the trainee
                          presses a weight upwards while lying on a weight training bench. 
                          The exercise uses the pectoralis major, the anterior deltoids, and the triceps,
                          among other stabilizing muscles. A barbell is generally used to hold the weight, 
                          but a pair of dumbbells can also be used.`,
            difficulty: 2, 
            typeOfExercise: "Compound exercise",
            muscles: ["Chest", "Shoulders", "Arms"],
            properFormLink: "https://www.youtube.com/embed/XSza8hVTlmM" 
          },

          { id: 1,
            name: "Deadlift",
            description: `Deadlift refers to the lifting of dead weight (weight without momentum),
                          such as weights lying on the ground. It is one of the few standard weight training exercises
                          in which all repetitions begin with dead weight. In most other lifts, there is an eccentric 
                          (lowering of the weight) phase followed by the concentric (lifting of the weight) phase. 
                          During these exercises, a small amount of energy is stored in the stretched muscles and 
                          tendons in the eccentric phase if the lifter is not flexible beyond the range of motion.
                          Although this exercise uses the legs and hips as the primary movers, it can also be considered a back exercise.`,
            difficulty: 3, 
            typeOfExercise: "Compound exercise",
            muscles: ["Legs", "Back", "Core"],
            properFormLink: "https://www.youtube.com/embed/op9kVnSso6Q" 
          },

          { id: 2,
            name: "Squat",
            description: `A squat is a strength exercise in which the trainee lowers their hips from a standing position
                          and then stands back up. During the descent of a squat, the hip and knee joints flex while
                          the ankle joint dorsiflexes; conversely the hip and knee joints extend and the ankle joint
                          plantarflexes when standing up. Squats are considered a vital exercise for increasing the strength and size of the lower body
                          muscles as well as developing core strength. The primary agonist muscles used during the squat are
                          the quadriceps femoris, the adductor magnus, and the gluteus maximus.`,
            difficulty: 3, 
            typeOfExercise: "Compound exercise",
            muscles: ["Legs", "Core"],
            properFormLink: "https://www.youtube.com/embed/ultWZbUMPL8"
          },

          { id: 3,
            name: "Pull-up",
            description: `A pull-up is an upper-body strength exercise. The pull-up is a closed-chain movement where 
                          the body is suspended by the hands and pulls up. As this happens, the elbows 
                          flex and the shoulders adduct and extend to bring the elbows to the torso.`,
            difficulty: 2, 
            typeOfExercise: "Compound exercise",
            muscles: ["Upper back", "Arms"],
            properFormLink: "https://www.youtube.com/embed/HRV5YKKaeVw"
          },

          { id: 4,
            name: "Push-up",
            description: `A push-up is a common calisthenics exercise beginning from the prone position. 
                          By raising and lowering the body using the arms, push-ups exercise the pectoral muscles, 
                          triceps, and anterior deltoids, with ancillary benefits to the rest of the deltoids, 
                          serratus anterior, coracobrachialis and the midsection as a whole. Push-ups are a basic 
                          exercise used in civilian athletic training or physical education and commonly in military 
                          physical training.`,
            difficulty: 1, 
            typeOfExercise: "Compound exercise",
            muscles: ["Chest", "Shoulders", "Arms", "Core"],
            properFormLink: "https://www.youtube.com/embed/0pkjOk0EiAk"
          },

          { id: 5,
            name: "Overhead Press",
            description: `The overhead press (abbreviated OHP), also referred to as a shoulder press, military press,
                          or simply the press, is a weight training exercise with many variations. It is typically performed
                          while either standing or sitting sometimes also when squatting, in which a weight is pressed straight
                          upwards from racking position until the arms are locked out overhead, while the legs, lower back and
                          abs maintain balance.[1] The exercise helps build muscular shoulders with bigger arms, and is one
                          of the most difficult compound upper-body exercises.`,
            difficulty: 2, 
            typeOfExercise: "Compound exercise",
            muscles: ["Shoulders", "Arms", "Core"],
            properFormLink: "https://www.youtube.com/embed/2yjwXTZQDDI"
          },

          { id: 6,
            name: "Bent-over Row",
            description: `A bent-over row (or barbell row) is a weight training exercise 
                          that targets a variety of back muscles. Which ones are targeted varies on form. 
                          The bent over row is often used for both bodybuilding and powerlifting. 
                          It is a good exercise for increasing strength and size`,
            difficulty: 2, 
            typeOfExercise: "Compound exercise",
            muscles: ["Back", "Arms", "Core"],
            properFormLink: "https://www.youtube.com/embed/kBWAon7ItDw"
          },

          { id: 7,
            name: "Biceps Curl",
            description: `Biceps curl is a general term for a series of strength exercises 
                          that involve brachioradialis, front deltoid and the main target on biceps brachii.
                          Includes variations using barbell, dumbbell and resistance band, etc. The common point
                          amongst them is the trainee lifting a certain amount of weight to contracting the biceps
                          brachii, and tuck in their arms to the torso during the concentric phase. Once the biceps brachii
                          is fully contracted, then return the weight to starting position during the eccentric phase.`,
            difficulty: 1, 
            typeOfExercise: "Isolated exercise",
            muscles: ["Biceps", "Arms"],
            properFormLink: "https://www.youtube.com/embed/ykJmrZ5v0Oo"
          },

          { id: 8,
            name: "French Press",
            description: `Lying triceps extensions, also known as skull crushers and French extensions
                          or French presses, are a strength exercise used in many different forms of strength training.
                          Lying triceps extensions are one of the most stimulating exercises to the entire triceps muscle
                          group in the upper arm. It works the triceps from the elbow all the way to the latissimus dorsi.
                          Due to its full use of the Triceps muscle group, the lying triceps extensions are used by many
                          as part of their training regimen.`,
            difficulty: 1, 
            typeOfExercise: "Isolated exercise",
            muscles: ["Triceps", "Arms"],
            properFormLink: "https://www.youtube.com/embed/JImgCWzCHwI"
          },

          { id: 9,
            name: "Running",
            description: `Running is a method of terrestrial locomotion allowing humans and other animals
                          to move rapidly on foot. Running is a type of gait characterized by an aerial phase in which
                          all feet are above the ground (though there are exceptions). A feature of a running
                          body from the viewpoint of spring-mass mechanics is that changes in kinetic and potential energy
                          within a stride occur simultaneously, with energy storage accomplished by springy tendons and
                          passive muscle elasticity. The term running can refer to any of a variety of speeds ranging from jogging to sprinting. `,
            difficulty: 1, 
            typeOfExercise: "Aerobic exercise",
            muscles: ["Legs", "Core"],
            properFormLink: "https://www.youtube.com/embed/brFHyOtTwH4"
          }
        ]
      }
    },
    clearAllProducts: false,
    oldSettingsData: {}
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => { updateGauges() }, [ state.dateIds ]);

  const updateMealSummary = (object, mealId) => {
    dispatch({ type: ACTIONS.UPDATE_MEALS_INGREDIENTS_SUMMARY, payload: {data: object, mealId: mealId} });
    updateDailySummary();
  } 

  const updateDailySummary = () => {
    dispatch({ type: ACTIONS.UPDATE_DAILY_INGREDIENTS_SUMMARY });
    updateGauges();
  }

  const updateGauges = () => {
    Object.keys(state.settingsData.nutrition.dailyDemand).forEach(ingredient => {
      dispatch({ type: ACTIONS.COUNT_GAUGES_DATA, payload: { typeOfIngredient: ingredient} });
    });
  }

  const updateDateIds = (newDateIds) => {
    dispatch({type: ACTIONS.CHANGE_DATE, payload: newDateIds })
  }

  const changePageTitle = (categoryTitle) => {
    let newPageTitle = '';

    if (categoryTitle === 'Nutrition')
      newPageTitle = 'Dashboard';
    else
      newPageTitle = categoryTitle;

    dispatch({type: ACTIONS.CHANGE_PAGE_TITLE, payload: newPageTitle });
    dispatch({ type: ACTIONS.SET_CLEAR_ALL_PRODUCTS, payload: false });
    restoreSettingsFromBackup();
  }

  const handleMenu = (categoryTitle) => {
    changePageTitle(categoryTitle);
  }

  const resetCheckbox = (idOfCheckbox) => {
    document.querySelector("#" + idOfCheckbox).checked = false;
  }

  const saveSettingsToLocalStorage = () => {
    localStorage.setItem("settings", JSON.stringify(state.settingsData));
  }

  const restoreSettingsFromBackup = () => {
    dispatch({ type: ACTIONS.RESTORE_OLD_SETTINGS });
  }

  const backupSettings = () => {
    dispatch({ type: ACTIONS.BACKUP_OLD_SETTINGS });
  }

  const confirmClearAllProducts = () => {
    dispatch({ type: ACTIONS.SET_CLEAR_ALL_PRODUCTS, payload: false });

    Object.keys(localStorage).forEach(key => {
      if (key === "settings" || key === "predefined")
        console.log(key);
      else
        localStorage.removeItem(key);
    });
  }

  const cancelClearAllProducts = () => {
    dispatch({ type: ACTIONS.SET_CLEAR_ALL_PRODUCTS, payload: false });
  }

  const handleSettingsSaved = (e) => {
    e.preventDefault();

    if (e.target[4].checked === true)
      dispatch({ type: ACTIONS.SET_CLEAR_ALL_PRODUCTS, payload: true });

    backupSettings();
    restoreSettingsFromBackup();
    saveSettingsToLocalStorage();
    resetCheckbox("clearAllProducts");
    updateGauges();
  }

  const handleSettingsCanceled = (e) => {
    e.preventDefault();
    restoreSettingsFromBackup();
    saveSettingsToLocalStorage();
    resetCheckbox("clearAllProducts");
    updateGauges();
  }

  const handleSettingOnChange = (e) => {
    const isNumber = /[0-9]/;
    const isZero = /^[0]{1}/;

    e.preventDefault();
  
    if (e.target.id === 'editMealName') {
      dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, index: Number(e.target.attributes["data-key"].value), value: e.target.value }})
    }
    
    if (isNumber.test(e.target.value[e.target.value.length - 1])) {

      if (isZero.test(e.target.value))
        dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, value: 1 }});
      else
        dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, value: e.target.value }});
    }

    else
      dispatch({ type: ACTIONS.CHANGE_SETTINGS_DATA, payload: { key: e.target.id, value: "" }});

    updateGauges();
  }

  return (
    <div className="wrapper">

      <aside className="left-section">

        <header className="left-section__logo-container">
          <Logo />
          <Title />
        </header>

        <ul className="left-section__menu-container">

          { MENU_CATEGORIES.map((category, index) => {
              return <MenuItem key={ index } value={ category } href="" isActive={ false } linkTo={ handleMenu } />
            })
          }

        </ul>

        <h2 className="left-section__quotation-container">
          <Quotation />
        </h2>
        
      </aside>


      <main className="center-section">


        <section className="center-section__top">
        
          <h3 className="center-section__top__title">{ state.pageTitle }</h3>

          { ((state.pageTitle === 'Dashboard') || (state.pageTitle === 'Training')) && 
            <DateChanger changeDate={ updateDateIds } />
          }

        </section>

      
        <section className="center-section__main">


        { state.pageTitle === 'Log in' &&

          <h2>Log in</h2>
        
        }

        { state.pageTitle === 'Training' && 

          state.settingsData.training.exercises.map(exercise => {
            return (
              <Exercise
                key={ exercise.id } 
                exerciseId={ exercise.id } 
                dateIds={ state.dateIds } 
                name={ exercise.name } 
                difficulty={ exercise.difficulty } 
                description={ exercise.description } 
                muscles={ exercise.muscles } 
                typeOfExercise={ exercise.typeOfExercise } 
                properFormLink={ exercise.properFormLink }>
              </Exercise>
            )})
        }

        { state.pageTitle === 'Dashboard' && 

          Object.values(state.settingsData.nutrition.namesOfMeals).map((meal, index) => {
            if (state.settingsData.nutrition.numberOfMeals > index)
              return <Meal key={ index } name={ meal } mealId={ index } dateIds={ state.dateIds } updateGauges={ updateMealSummary } />
            })

        }

        { state.pageTitle === 'Settings' &&

          <>

          {state.clearAllProducts && 
            <>
              <div>Remove ALL products?</div>
              <button onClick={ confirmClearAllProducts }>Remove</button>
              <button onClick={ cancelClearAllProducts }>Cancel</button>
            </>
          }
          <section className="center-section__main__settings">

            <form className="center-section__main__settings__form" onSubmit={ handleSettingsSaved }>

              <section className="center-section__main__settings__form__section">

                <h2 className="center-section__main__settings__form__section__title">Nutrition</h2>

                <label htmlFor="setDailyDemand">Set daily demand: </label>

                <section id="setDailyDemand" className="center-section__main__settings__form__section__daily-demand">
                  <span className="center-section__main__settings__form__section__input">
                    <label htmlFor="kcal">Kcal: </label>
                    <input 
                      type="text" 
                      id="kcal"
                      value={ state.settingsData.nutrition.dailyDemand.kcal }
                      maxLength={5}
                      onChange={ handleSettingOnChange }
                      required />
                  </span>
                  
                  <span className="center-section__main__settings__form__section__input">
                    <label htmlFor="proteins">Proteins: </label>
                    <input 
                      type="text" 
                      id="proteins"
                      value={ state.settingsData.nutrition.dailyDemand.proteins }
                      maxLength={4}
                      onChange={ handleSettingOnChange }
                      required />
                  </span>

                  <span className="center-section__main__settings__form__section__input">
                    <label htmlFor="fats">Fats: </label>
                    <input 
                      type="text" 
                      id="fats"
                      value={ state.settingsData.nutrition.dailyDemand.fats }
                      maxLength={4}
                      onChange={ handleSettingOnChange }
                      required />
                  </span>

                  <span className="center-section__main__settings__form__section__input">
                    <label htmlFor="carbs">Carbs: </label>
                    <input 
                      type="text" 
                      id="carbs"
                      value={ state.settingsData.nutrition.dailyDemand.carbs }
                      maxLength={4}
                      onChange={ handleSettingOnChange } 
                      required />
                  </span>

                </section>

                <span className="center-section__main__settings__form__section__input">
                  <label htmlFor="clearAllProducts">Clear all products: </label>
                  <input 
                    type="checkbox" 
                    id="clearAllProducts" />
                </span>

                <span className="center-section__main__settings__form__section__input">
                  <label htmlFor="setMealsNumber">Set number of meals: </label>
                  <input 
                    type="text" 
                    id="setMealsNumber"
                    maxLength="1"
                    value={ state.settingsData.nutrition.numberOfMeals }
                    onChange={ handleSettingOnChange }
                    required />
                </span>

                
                { Object.values(state.settingsData.nutrition.namesOfMeals).map((meal, index) => {
                  if (state.settingsData.nutrition.numberOfMeals > index) {
                    return (
                      <span key={ index } className="center-section__main__settings__form__section__input">
                        <label htmlFor="editMealName">Set meal name: </label>
                        <input
                          data-key={ index }
                          type="text" 
                          id="editMealName"
                          value={ state.settingsData.nutrition.namesOfMeals[index] } 
                          onChange={ handleSettingOnChange }
                          required />
                      </span>
                    ) 
                  }

                  else {
                    return (
                      null
                    )
                  }
                })}
                
              </section>

              <input 
                className="center-section__main__settings__form__submit-button"
                type="submit" 
                value="Save" 
                id="saveSettings"/>

              <button 
                className="center-section__main__settings__form__cancel-button"
                onClick={ handleSettingsCanceled } 
                disabled={ state.oldSettingsData === state.settingsData ? true : false }>
                Cancel
              </button>

            </form>

          </section>

          </>

        }

        { state.pageTitle === 'About' &&

          <h2>About</h2>
        
        }

        </section>


      </main>


      <aside className="right-section">

        <Gauge 
          amount={ state.gaugesData.kcal.eaten }
          name="kcal"
          percent={ state.gaugesData.kcal.percent }
          left={ state.gaugesData.kcal.left }
          isKcal={true} />

        <Gauge 
          amount={ state.gaugesData.proteins.eaten }
          name="proteins" 
          percent={ state.gaugesData.proteins.percent }
          left={ state.gaugesData.proteins.left } />
        
        <Gauge 
          amount={ state.gaugesData.fats.eaten }
          name="fats" 
          percent={ state.gaugesData.fats.percent }
          left={ state.gaugesData.fats.left } />
        
        <Gauge 
          amount={ state.gaugesData.carbs.eaten }   
          name="carbohydrates" 
          percent={ state.gaugesData.carbs.percent }
          left={ state.gaugesData.carbs.left } />

      </aside>


    </div>
  )
}


// RENDERING

ReactDOM.render(<App />, document.querySelector("#root"));