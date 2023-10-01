import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Mobile_homepage from './Mobile_homepage'; 
import LandingPage from './HomePage2';

const Realhomepage = () => {

    const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <div>     
        {isSmallScreen ? <Mobile_homepage /> : <LandingPage />}
    </div>
  )
}


export default Realhomepage

