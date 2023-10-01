import React, { useState, useContext, useEffect } from "react";

export const ArrayContext = React.createContext();

// Context for the global waypoints array holding all stops
export const ArrayProvider = ({ children }) => {
  const [globalArray, setGlobalArray] = useState(() => {
    const savedArray = localStorage.getItem('globalArray');
    if (savedArray && savedArray !== "undefined") {
      return JSON.parse(savedArray);
    }
    return [];
  });


  useEffect(() => {
    localStorage.setItem('globalArray', JSON.stringify(globalArray));
  }, [globalArray]);

  // Getter method
  const getGlobalArray = () => globalArray;

  // Setter method
  const setGlobalArrayValue = (newArray) => {
    setGlobalArray(newArray);
  };

  // Remove specified item method
  const removeFromGlobalArray = (item) => {
    const newArray = globalArray.filter(value => value !== item);
    setGlobalArray(newArray);
  };

  // Get item at index method
  const getGlobalArrayItem = (index) => globalArray[index];

  // Add item to index method
  const addToGlobalArray = (item, index) => {
    const newArray = [...globalArray];
    newArray.splice(index, 0, item);
    setGlobalArray(newArray);
  };


  return (
    <ArrayContext.Provider value={{
      globalArray,
      getGlobalArray,
      setGlobalArrayValue,
      removeFromGlobalArray,
      getGlobalArrayItem,
      addToGlobalArray
    }}>
      {children}
    </ArrayContext.Provider>
  );
};

// Create a custom hook for using the waypoints array context
export const useWaypointsArray = () => useContext(ArrayContext);