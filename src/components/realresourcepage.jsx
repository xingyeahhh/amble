import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Foryouerro from './foryouerro';
import Resources from './resources';

const Realrespage = () => {

    const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <div>     
        {isSmallScreen ? <Foryouerro /> : <Resources/>}
    </div>
  )
}


export default Realrespage;

