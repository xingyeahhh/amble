import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a new context
export const MapInputContext = createContext();

// Create a provider component
export const MapInputProvider = ({ children }) => {
  // Initialize state with value from local storage or default values
  const [inputValues, setInputValues] = useState(() => {
    const savedState = localStorage.getItem('inputValues');
    if (savedState && savedState !== "undefined") {
      return JSON.parse(savedState);
    }
    return {
      "latitude": 0,
      "longitude": 0,
      "endLatitude": 0,
      "endLongitude": 0,
      "hour": 0,
      "distance": 0,
      waypoints: [],
    };
  });

  const [userdata, setUserdata] = useState(null);
  // Use useEffect to save state changes to local storage
  useEffect(() => {
    localStorage.setItem('inputValues', JSON.stringify(inputValues));
  }, [inputValues]);  // This will run every time inputValues changes
  
  return (
    <MapInputContext.Provider value={{ inputValues, setInputValues, userdata, setUserdata }}>
      {children}
    </MapInputContext.Provider>
  );
};

// Create a custom hook for using the map input context
export const useMapInput = () => useContext(MapInputContext);
