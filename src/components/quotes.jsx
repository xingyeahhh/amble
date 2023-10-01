import React, { useRef, useEffect, useState,useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';

import { createTheme,ThemeProvider  } from '@mui/material/styles';
import MenuBar2 from './MenuBar2';
import './quotes.css';
import MyButton from './mainbutton';
import MyFunctionButton from './functionbutton';
import MapBackground from './mapbackground';

import axios from 'axios';

function Quotes() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [showQuote, setShowQuote] = useState(false); // 新增的状态
  const [showBut, setShowBut] = useState(true); // 新增的状态

  useEffect(() => {
    GetNewQuote();
    }, []);

  let GetNewQuote = () => {
        axios.get('users/getquote')
        .then((response) => {
        const quotationsData = response.data;
        const quoteAuthors = Object.keys(quotationsData);
        // console.log(quoteAuthors)
        const randomIndex = Math.floor(Math.random() * quoteAuthors.length);
        const randomAuthor = quoteAuthors[randomIndex];
        const randomQuote = quotationsData[randomAuthor];
        setQuote(randomQuote);
        setAuthor(randomAuthor);
        })
        .catch((error) => {
        console.error('Error fetching data:', error);
    });
};

const theme = createTheme({
  palette: {
    primary: {main: '#004d40',},
    secondary: {main: '#004d40',},
  },
});


const toggleback = () => {
  
  exitandback();
  setTimeout(() => {
    
    setShowQuote(false);
        setShowBut(true);
  }, 500);
}


const exitandback = () => {
// 其他逻辑
hideElements();
};

const hideElements = () => {
document.querySelector(".quote").classList.add("hide");
document.querySelector(".h2-quote").classList.add("hide");
document.querySelector(".small-quote").classList.add("hide");
};
  
    return (
      <div className="quote-container">
       
       {showQuote && ( 
        <div className="quote" onClick={toggleback}>
          <div className='h2-quote'>{quote}</div>
          {/* <br></br> */}
          <div className='small-quote'>- {author}</div>
        </div>
      )}
           
           {showBut && ( 
            <div className="wrapper-function-quote" >
          <a
            className="wrapper-function-text-quote"
            onClick={()=>{GetNewQuote();
              setShowQuote(true);
              setShowBut(false);
            } }
            href="#"
            type="submit"
          >
            <span>Get a Reflection</span>
          </a>
        </div>
            )}
          </div>
    );
  }
  export default Quotes;