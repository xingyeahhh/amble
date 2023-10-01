import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Mobile_Mappage from './Mobile_Mappage'; 
import Interface2 from './interface2';

const Realmappage = () => {

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
        {isSmallScreen ? <Mobile_Mappage /> : <Interface2 />}
    </div>
  )
}


export default Realmappage

