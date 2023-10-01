// GreetingDataContext.js
import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export function useGreetingData() {
  return useContext(DataContext);
}

export function GreetingDataProvider({ children }) {
  const [data, setData] = useState({});
  const [greetingData, setGreetingData] = useState({});
  const [temp1, setTemp1] = useState("");
  const [temp2, setTemp2] = useState("");

  return (
    <DataContext.Provider value={{ data, setData, greetingData, setGreetingData, temp1, setTemp1, temp2, setTemp2 }}>
      {children}
    </DataContext.Provider>
  );
}