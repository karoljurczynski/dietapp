// IMPORTS

import { React, useState } from 'react';
import './styles/center.css';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
import { useEffect } from 'react';



// COMPONENTS

export default function DateChanger(props) {
  const [currentDate, setCurrentDate] = useState(0);

  const handlePreviousButton = () => {
    setCurrentDate(previousDate => previousDate - 1);
  }

  const handleNextButton = () => {
    setCurrentDate(previousDate => previousDate + 1);
  }

  useEffect(() => { props.changeDay(currentDate) }, [currentDate]);

  return (
    <div className="center-section__top__date-changer">

      <button 
        className="center-section__top__date-changer__previous-button"
        onClick={ handlePreviousButton }
        disabled={ currentDate === 0 ? true : false }>
        <FaChevronCircleLeft />
      </button>

      <h4 className="center-section__top__date-changer__current-date">{ currentDate }</h4>

      <button 
        className="center-section__top__date-changer__next-button"
        onClick={ handleNextButton }>
        <FaChevronCircleRight />
      </button>

    </div>
  )
}