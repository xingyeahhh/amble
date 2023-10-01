

import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { MapInputProvider } from './context/MapInputContext';
import { ArrayProvider } from "./context/ArrayContext";
import "./App.css";

import Interface from "./components/Interface";
import Login from "./components/login";
import LoginCheck from "./components/loginCheck";
import UserPreferences from "./components/userpref";
import ChatBox from "./components/ChatBox";
import Comms from "./components/Comms.jsx";
import Carbon from './components/carbon_calculator';
import Quotes from './components/quotes';
import Resources from './components/resources';
import { GreetingDataProvider } from './components/GreetingDataContext';
import HomePage from './components/HomePage';
import Interface2 from './components/interface2';
import ShowRoute from './components/ShowRoute';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Account from './components/Account';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/HomePage2';
import Box from "@mui/material/Box";
import Favicon from "react-favicon";
import Mobile_Mappage from './components/Mobile_Mappage';
import Mobile_homepage from './components/Mobile_homepage';
import Realhomepage from './components/realhomepage';
import Realmappage from './components/realmappage';
import Foryouerro from './components/foryouerro';
import Realrespage from './components/realresourcepage';
// If a route can not be displayed this function is invoked from Route path
function MatchAllRoute() {
  return <h2>The requested page does not exist</h2>;
}

function App() {
  return (
    <div>
      <Router>
        <ArrayProvider>
          <AuthContextProvider>
            <MapInputProvider>
              <GreetingDataProvider>
                <Favicon url="https://upload.wikimedia.org/wikipedia/commons/9/9d/Threads_%28app%29_logo.svg" />
                <Routes>
                  {/* <Route exact path="/" element={<LandingPage />} /> */}
                  <Route exact path="/" element={<Realhomepage />} />
                  <Route path="/mobilemappage" element={<Mobile_Mappage />} />
                  <Route path="/mobilehomepage" element={<Mobile_homepage />} />
                  <Route exact path="/map" element={<Interface2 />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/loginCheck" element={<LoginCheck />} />
                  <Route path="/userpref" element={<UserPreferences />} />
                  <Route path="*" element={<MatchAllRoute />} />
                  <Route path="/chatbox" element={<ChatBox />} />
                  <Route path="/showroute" element={<ShowRoute />} />
                  <Route path="/homepage" element={<HomePage />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/homepage" element={<HomePage />} />
                  <Route path="/resources" element={<Resources />} />
                  {/* <Route path="/realhomepage" element={<Realhomepage />} /> */}
                  <Route path="/realmappage" element={<Realmappage />} />
                  <Route path="/foryou-error" element={<Foryouerro />} />
                  <Route path="/realrespage" element={< Realrespage />} />
                  {/* <Route path="/chatgpt" element={<ChatGPT />} />
                  <Route path="/quotes" element={<Quotes />} /> */}
                  <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                </Routes>
              </GreetingDataProvider>
            </MapInputProvider>
          </AuthContextProvider>
        </ArrayProvider>
      </Router >
    </div >
  );
}

export default App;