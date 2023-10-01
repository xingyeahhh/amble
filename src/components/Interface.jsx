import React, { useRef, useEffect, useState } from 'react';
import "./Interface.css";

import Map from "./Map";
import StartPlace from "./start_place";
import Box from "@mui/material/Box";

function Interface() {
  return (
    <div>
      <div className="interface-container">
        {/* <div className="user-input">
          <StartPlace inputValues={inputValues} setInputValues={setInputValues} />
        </div> */}
        <div className="map-container">
          <Map />
        </div>
      </div>
    </div >
  );
}

export default Interface;