import React, { useRef, useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuBar2 from "./MenuBar2";
import "./chatgpt.css";
// import { globalArray } from './useRouteDisplay.jsx';
import MyButton from "./mainbutton";
import MyFunctionButton from "./functionbutton";
import MapBackground from "./mapbackground";
import Box from "@mui/material/Box";
import { ArrayContext, useWaypointsArray } from "../context/ArrayContext";
import { MapInputContext } from '../context/MapInputContext';
import { useMapInput } from '../context/MapInputContext';

import axios from "axios";

const ChatGPT = () => {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const { globalArray, setGlobalArrayValue } = useWaypointsArray();
  const { inputValues, setInputValues } = useContext(MapInputContext);
  console.log(globalArray);
  console.log(inputValues);

  // Create a list with the data from the amble
  const name = [];
  const type = [];
  const address = [];
  const coord = [];

  const dis = inputValues["distance"];
  console.log(dis);

  for (let item in globalArray) {
    // console.log(item + ':', globalArray[item]['name']);
    if (globalArray[item] && globalArray[item]["name"] != null) {
      const tempitem_name = globalArray[item]["name"];
      if (tempitem_name !== null && tempitem_name !== "Liege Park") {
        name.push(globalArray[item]["name"]);
      }
      const tempitem_type = globalArray[item]["type"];
      if (tempitem_type !== null) {
        type.push(globalArray[item]["type"]);
      }
      const tempitem_address = globalArray[item]["address"];
      if (tempitem_address !== null && tempitem_address !== "null") {
        address.push(globalArray[item]["address"]);
      }
      const tempitem_coord = globalArray[item]["location"];
      if (tempitem_coord !== null && tempitem_coord !== "null") {
        const lat = tempitem_coord["latitude"];
        const lon = tempitem_coord["longitude"];
        coord.push({ latitude: lat, longitude: lon });
      }
    }
  }
  console.log(name);
  console.log(type);
  console.log(address);
  console.log(coord);

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Clear the previous response
      setResponse("");
      const response = await axios.post("/users/chatgpt", {
        input: userInput,
      });
      setResponse(response.data.message);
      console.log(response.data.message);
    } catch (error) {
      console.error("Error fetching response from backend:", error);
    }
  };

  const theme = createTheme({
    palette: {
      primary: { main: "#004d40" },
      secondary: { main: "#004d40" },
    },
  });

  const currentDate = new Date();
  const dates = { month: "long", day: "numeric" };
  const formattedDate = currentDate.toLocaleString(undefined, dates);
  const [showgptbox, setShowGptbox] = useState(true); // 新增的状态
  const [showgptcon, setShowGptcon] = useState(false); // 新增的状态
  const [showBut, setShowBut] = useState(true); // 新增的状态

  // Define options
  const options = [
    {
      value: "",
      label: "Choose interesting amble stuff below:",
    },
    {
      value: `Tell me one thing good that happened on ${formattedDate}`,
      label: "1. Anything good happened on this day?",
    },
    {
      value: `Give me a short paragraph on ${name[1]} in Manhattan`,
      label: "2. Where is interesting to visit as I amble?",
    },
    {
      value: `Suggest some mindfulness classes around ${address[0]} `,
      label: "3. Suggest some mindfulness classes",
    },
    {
      value: `On average how many calories will I burn on a ${dis} km walk?`,
      label: "4. How many calories will I burn?",
    },
    {
      value: `What point of interest is found around longitude ${coord[0]["longitude"]} and latitude ${coord[0]["latitude"]}?`,
      label: "5. What else might I discover?",
    },
    {
      value: `Who was born on ${formattedDate}?`,
      label: "6. Who was born on this day?",
    },
  ];


  const toggleback = () => {

    exitandback();
    setTimeout(() => {
      setShowGptbox(true);
      setShowGptcon(false);
      setShowBut(true);
    }, 500);
  }


  const exitandback = () => {
    // 其他逻辑
    hideElements();
  };

  const hideElements = () => {
    document.querySelector(".response-container").classList.add("hide");
    document.querySelector(".response-text").classList.add("hide");
  };

  return (
    <>
      <div className="gpt-container">
        {showBut && showgptbox && (
          <>
            <div className="select-area" >
              <select
                className="gpt-select"
                value={userInput}
                onChange={(event) => {
                  handleChange(event);
                }}
              >
                {options.map((option) => (
                  <option
                    className="gpt-opt"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="wrapper-function-gpt">
              <a
                className="wrapper-function-text-gpt"
                onClick={() => {
                  handleSubmit();
                  setShowGptbox(false);
                  setShowGptcon(true);
                  setShowBut(false);


                }}
                href="#"
                type="submit"
              >
                <span>Learn Something Interesting</span>
              </a>
            </div>
          </>
        )}

        {showgptcon && response && (
          <div className="response-container" onClick={toggleback}>
            {response && <div className="response-text">{response}</div>}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatGPT;
