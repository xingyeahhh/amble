import React, { useRef, useEffect, useState,useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';

import { createTheme,ThemeProvider  } from '@mui/material/styles';
import MenuBar2 from './MenuBar2';
import './carbon_calculator.css';
// import { globalArray } from './useRouteDisplay.jsx';
import MyButton from './mainbutton';
import MyFunctionButton from './functionbutton';
import MapBackground from './mapbackground';
import Box from "@mui/material/Box";
import { ArrayContext, useWaypointsArray } from '../context/ArrayContext';
import { MapInputContext } from '../context/MapInputContext';
import { useMapInput } from '../context/MapInputContext';

const Carbon = () => {
    const [value, setValue] = useState(0);

    const { inputValues, setInputValues } = useContext(MapInputContext);
    
    const dist = inputValues["distance"];
    const co2_per_mile = 0.77;
    const total_co2 = (dist * co2_per_mile).toFixed(2);
    const co2_per_tree_per_year = 22;
    const tree_per_mile = 1/(co2_per_tree_per_year / co2_per_mile);
    const percentage_of_tree = tree_per_mile * dist * 3; 
    const num_trees = Math.round(0.8285 * dist * 3);
    console.log (dist);

    const [showtreecon, setShowtreecon] = useState(false); // 新增的状态
  const [showBut, setShowBut] = useState(true); // 新增的状态


  const [alertText, setAlertText] = useState(''); // State to hold alert text
  const [showAlertText, setShowAlertText] = useState(false); // State to control visibility
  const handleSeeTreesClick = () => {
    const message = 'If you did this walk 3 times a week for a year, that is a Carbon Savings equivalent to planting ' + num_trees + ' trees';
    setAlertText(message);
    setShowAlertText(true);
    setShowtreecon(true);
    setShowBut(false);
};


const toggleback = () => {
  
    exitandback();
    setTimeout(() => {
      setShowtreecon(false);
          setShowBut(true);
    }, 500);
  }


const exitandback = () => {
  // 其他逻辑
  hideElements();
};

const hideElements = () => {
  document.querySelector(".treenum-con").classList.add("hide");
  document.querySelector(".treenum-h3").classList.add("hide");
  document.querySelector(".treenum-text").classList.add("hide");
};


return (<>
    
        <div className="imagecarbon-container">
           
        {showtreecon && ( 
        <div  className='treenum-con' onClick={toggleback}>
            <div className='treenum-h3'>See how many new trees your amble is equivalent to:</div>
           <div className='treenum-text'>  {showAlertText && <p>{alertText}</p>}</div>
     </div>
  )}

     {showBut && ( 
            <div className="wrapper-function-tree" >
          <a
            className="wrapper-function-text-tree"
            onClick={handleSeeTreesClick}
            href="#"
            type="submit"
          >
            <span>Your amble Trees</span>
          </a>
        </div>
     )}


       
        </div>
        </>
    ); 

};
export default Carbon;