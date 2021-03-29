// IMPORTS

import { React, useState, useEffect } from 'react';
import './styles/center.css';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';


// COMPONENTS

export default function DateChanger(props) {
  const initialDate = new Date();
  const [currentDay, setCurrentDay] = useState(initialDate.getDate());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  const translateMonth = () => {
    switch(currentMonth) {
      case 1: return 'January';
      case 2: return 'February';
      case 3: return 'March';
      case 4: return 'April';
      case 5: return 'May';
      case 6: return 'June';
      case 7: return 'July';
      case 8: return 'August';
      case 9: return 'September';
      case 10: return 'October';
      case 11: return 'November';
      case 12: return 'December';
    }
  }

  const isLeapYear = () => {
    if (((currentYear % 4 === 0) && (currentYear % 100 !== 0)) || currentYear % 400 === 0)
       return true;
    
    else
       return false;
  }

  const isDayLastInMonth = () => {
    if ((currentDay === 29 && currentMonth === 2 && isLeapYear()) ||
        (currentDay === 28 && currentMonth === 2 && !isLeapYear()) ||
        (currentDay === 30 && ((currentMonth === 4) || 
                            (currentMonth === 6) || 
                            (currentMonth === 9) ||
                            (currentMonth === 11))) ||
        (currentDay === 31))
      return true;
    
    else
      return false;
  }

  const isDayLastInDecember = () => {
    if ((currentDay === 31) && (currentMonth === 12))
      return true;
    
    else
      return false;
  }

  const changeNextDay = () => {
    if(isDayLastInMonth()) {

      if(isDayLastInDecember()) {
        setCurrentDay(1);
        setCurrentMonth(1);
        setCurrentYear(previousYear => previousYear + 1);
      }

      else {
        setCurrentDay(1);
        setCurrentMonth(previousMonth => previousMonth + 1);
      }
    }

    else {
      setCurrentDay(previousDay => previousDay + 1);
    }
  }

  const handleNextButton = () => {
    changeNextDay();
  }



  const isDayFirstInMonth = () => {
    if(currentDay === 1)
      return true;
    else
      return false;
  }

  const isDayFirstInJanuary = () => {
    if ((currentDay === 1) && (currentMonth === 1))
      return true;
    
    else
      return false;
  }

  const isDayFirstInMarch = () => {
    if ((currentDay === 1) && (currentMonth === 3))
      return true;
    
    else
      return false;
  }

  const isDayFirstIn30DayMonths = () => {
    if ((currentDay === 1) && ((currentMonth === 4) || (currentMonth === 6) || (currentMonth === 8) || (currentMonth === 9) || (currentMonth === 11)))
      return true;
    
    else
      return false;
  }

  const changePreviousDay = () => {

    if (isDayFirstInJanuary()) {
      setCurrentDay(31);
      setCurrentMonth(12);
      setCurrentYear(previousYear => previousYear - 1);
    }

    else if (isDayFirstInMarch()) {
      if(isLeapYear())
        setCurrentDay(29);
      else
        setCurrentDay(28);
      
      setCurrentMonth(2);
    }

    else if (isDayFirstIn30DayMonths()) {
      setCurrentDay(31);
      setCurrentMonth(previousMonth => previousMonth - 1);
    }

    else if (isDayFirstInMonth()) {
      setCurrentDay(30);
      setCurrentMonth(previousMonth => previousMonth - 1);
    }
    
    else {
      setCurrentDay(previousDay => previousDay - 1);
    }
  }

  const handlePreviousButton = () => {
    changePreviousDay();
  }


  useEffect(() => { 
    props.changeDate({ currentDay, currentMonth, currentYear });

  }, [currentDay, currentMonth, currentYear]);


  return (
    <div className="center-section__top__date-changer">

      <button 
        className="center-section__top__date-changer__previous-button"
        onClick={ handlePreviousButton }>
        <FaChevronCircleLeft />
      </button>

      <h4 className="center-section__top__date-changer__current-date">{ `${translateMonth()} ${currentDay}` }</h4>

      <button 
        className="center-section__top__date-changer__next-button"
        onClick={ handleNextButton }>
        <FaChevronCircleRight />
      </button>

    </div>
  )
}