
//新的特殊加入的！！
import RouteIcon from '@mui/icons-material/Route';
import TuneIcon from '@mui/icons-material/Tune';
import "./Map_Mobile.css"
import HMobiledataIcon from '@mui/icons-material/HMobiledata';


import React, { useRef, useEffect, useState, useContext } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import DateTimePicker from "react-datetime-picker";
import axios from "axios";
import { useMapInput } from "../context/MapInputContext";
import routedirection from "./routedirection";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MapIcon from '@mui/icons-material/Map';

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import HomeIcon from "@mui/icons-material/Home";

import SearchIcon from "@mui/icons-material/Search";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { Link, useNavigate } from "react-router-dom";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

import useRouteDisplay from "./useRouteDisplay";
import useGeocoding from "./useGeocoding";
import useMapInit from "./useMapInit";
import usePlaceNameChange from "./usePlaceNameChange";
import useHeatmap from "./useHeatmap";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

import { ArrayContext, useWaypointsArray } from "../context/ArrayContext";
import ChatBox from "./ChatBox";
import Ratings from "./Ratings";
import CircularProgress from '@mui/material/CircularProgress';

import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { StandaloneSearchBox } from "@react-google-maps/api";

import Select from 'react-select';

const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
mapboxgl.accessToken = apiKey;

const Map_Mobile = () => {
  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#ff6d75",
    },
    "& .MuiRating-iconHover": {
      color: "#ff3d47",
    },
  });


  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: 0,
      // margin:'0px',
      color: '#014e3d',
     
      width: '350px', // 或者设置您需要的具体宽度值
      borderColor: '#014e3d', // 修改边框颜色
      borderWidth: '1.5px', // 修改边框粗细
      '&:hover': {
        borderColor: '#014e3d', // 修改 hover 边框颜色
      },
      '&:focus': {
        borderColor: '#014e3d', // 修改被点击时的边框颜色
      }
    }),
    option: (provided, state) => ({
      ...provided,
      height:'1.6rem',
      backgroundColor: state.isFocused ? 'white' : 'white', // 修改 hover 颜色
      '&:hover': {
        backgroundColor: '#b1ff05', // 修改 hover 颜色
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: '#014e3d', // 修改选中颜色
    }),
  };


  const navigate = useNavigate();
  const normalImagePath = "/static/images/chatamble3.png";
  const hoverImagePath = "/static/images/chatamble2.png";

  const { inputValues, setInputValues } = useMapInput();
  const { globalArray, setGlobalArrayValue } = useWaypointsArray();
  const [walkRating, setWalkRating] = useState(2);
  const [waypointRatings, setWaypointRatings] = useState({});
  const [isCheckboxesVisible, setCheckboxesVisible] = useState(true);
  const [isHeatmapVisible, setHeatmapVisible] = useState(true);
  const [isOtherHeatmapVisible, setOtherHeatmapVisible] = useState(false);
  //console.log(globalArray)

  const mapContainer = useRef(null);
  const [lat, setLat] = useState(40.73);
  const [lng, setLng] = useState(-73.445);
  const [zoom, setZoom] = useState(12.4);
  const [beginLocationPressed, setBeginLocationPressed] = useState(false);
  const [endLocationPressed, setEndLocationPressed] = useState(false);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const [sliderUnit, setSliderUnit] = useState("km");
  const [showBeginField, setShowBeginField] = useState(false);
  const [showEndField, setShowEndField] = useState(false);
  const [initialTime, setInitialTime] = useState(() => {
    const now = new Date();
    if (now.getMinutes() !== 0) {
      now.setHours(now.getHours() + 1, 0, 0, 0);
    }
    return now;
  });
  const [time, setTime] = useState(initialTime);
  const [showDistanceInput, setShowDistanceInput] = useState(false); //change to false
  const [showBeginLocationInput, setShowBeginLocationInput] = useState(false); //change to false
  const [showEndLocationInput, setShowEndLocationInput] = useState(false); //change to false
  const [showPreferencesInput, setShowPreferencesInput] = useState(false); //change to false
  const [showGoButton, setShowGoButton] = useState(false);
  const [nowSelected, setNowSelected] = useState(false);
  const [laterSelected, setLaterSelected] = useState(false);
  const [homeSelected, setHomeSelected] = useState(false);
  const [searchSelected, setSearchSelected] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);
  const [endHomeSelected, setEndHomeSelected] = useState(false);
  const [endSearchSelected, setEndSearchSelected] = useState(false);
  const [endAddressSelected, setEndAddressSelected] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [activeSearchBox, setActiveSearchBox] = useState(null);

  const options = [
    // { value: 'park', label: 'Parks' },
    { value: 'library_locations', label: 'Libraries' },
    { value: 'worship_locations', label: 'Places of Worship' },
    { value: 'community_locations', label: 'Community Centres' },
    { value: 'museum_art_locations', label: 'Museums & Art Galleries' },
    // { value: 'walking_node_locations', label: 'Other Walking Nodes' },
    // { value: 'park_node_locations', label: 'Other Park Nodes' },
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
    setShowGoButton(true);
  };

  const selectedValues = selectedOptions.map((option) => option.value);

  const handlePreferencesSubmit = () => {
    return axios
      .post('/users/preferences', { selectedOptions: selectedValues })
      .then((response) => {
        console.log('Preferences Data:', response.data);
        return response.data; // Return response data for further use
      })
      // If error, alert console
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log("Status code:", error.response.status);
          console.log("Error Message", error.message);
          console.log("Response Data:", error.response.data);

        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
      });
  };

  const { map, markers } = useMapInit(
    mapContainer,
    lat,
    lng,
    zoom,
    inputValues,
    setInputValues,
  );

  // Heatmap Visibility & Toggles
  const toggleCheckboxes = () => {
    setCheckboxesVisible(!isCheckboxesVisible);
  };

  const handleToggleHeatmap = () => {
    setHeatmapVisible(!isHeatmapVisible);
    setOtherHeatmapVisible(false);
  };


  const handleToggleOtherHeatmap = () => {
    setOtherHeatmapVisible(!isOtherHeatmapVisible);
    setHeatmapVisible(false);
  };

  useHeatmap(map, isHeatmapVisible, isOtherHeatmapVisible);

  const { route, displayRoute, directiondata } = useRouteDisplay(
    map.current,
    inputValues,
    setInputValues,
    setGlobalArrayValue,
  );
  const { location, setLocation } = useGeocoding(
    map.current,
    beginLocationPressed,
    setBeginLocationPressed,
    endLocationPressed,
    setEndLocationPressed,
    inputValues,
    setInputValues,
    showBeginLocationInput,
    setShowBeginLocationInput,
    showEndLocationInput,
    setShowEndLocationInput,
    setShowPreferencesInput,
    setShowGoButton,
  );
  const { placeName, suggestions, handlePlaceNameChange, handlePlaceSelect } =
    usePlaceNameChange("", activeSearchBox, setInputValues, showBeginLocationInput, showEndLocationInput, setShowEndLocationInput, setShowPreferencesInput, setShowGoButton);
  
    const handleNowButtonClick = () => {
    setNowSelected(true);
    setLaterSelected(false);
    const now = new Date();
    const currentHour = now.getHours();
    setInputValues((prevValues) => ({ ...prevValues, hour: currentHour }));

    // Round the current time to the nearest minute
    const roundedMinutes = Math.round(now.getMinutes());
    now.setMinutes(roundedMinutes);

    // Set the time state to the rounded time
    setTime(now);

    setShowTimeInput(false);

    setShowDistanceInput(true);
  };

  const handleLaterButtonClick = () => {
    setNowSelected(false);
    setLaterSelected(true);
    const now = new Date();
    let currentHour = now.getHours();

    // Round the current time up to the nearest hour
    if (now.getMinutes() > 0) {
      currentHour += 1;
    }
    now.setHours(currentHour, 0, 0, 0);

    setInputValues((prevValues) => ({ ...prevValues, hour: currentHour }));

    // Set the time state to the rounded time
    setTime(now);

    // Show the date-time picker
    setShowTimeInput(true);

    setShowDistanceInput(true);
  };

  const handleTimeChange = (value) => {
    const [hours, minutes] = value.split(":");
    const time = new Date(inputValues.time);
    time.setHours(hours, minutes);
    setInputValues((prevValues) => ({ ...prevValues, time }));
  };

  const handleSliderChange = (event) => {
    const newDistance = event.target.value;
    setInputValues((prevValues) => ({ ...prevValues, distance: newDistance }));
    //console.log("handleSliderChange", inputValues);
  };

  const handleInputSubmit = async (e) => {
    e.preventDefault();

    console.log("handleInputSubmit", inputValues);

    try {
      const response = await axios.post(
        "/users/handle_routeinpput_data",
        inputValues,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("errorless:", response.data);
      const waypoints = response.data["waypoints"];
      console.log("waypoints:", waypoints);
      setInputValues({ ...inputValues, ["waypoints"]: waypoints });
      console.log("handleInputSubmit", inputValues);

      //changewindow
      setplansetwin(false);
      setchatalien(true);
      setroutedetail(true);

      //为了mobile新加的
      setmobileshowbut(true);

    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log("server responded with error");
      } else if (error.request) {
        console.log("network error");
      } else {
        console.log(error);
      }
    }
  };

  const handleOverallSubmit = async (e) => {

    console.log("handleOverallSubmit", inputValues);
    if (inputValues.distance <= 1.5) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1000);
      return;
    }

    e.preventDefault();
  
    try {
      // First, handle preferences
      await handlePreferencesSubmit();
      console.log('Preferences submitted successfully');
  
      // Next, handle the input
      await handleInputSubmit(e); // You might need to pass any necessary parameters here
      console.log('Input submitted successfully');
    } catch (error) {
      console.log('An error occurred:', error);
      // Handle error, perhaps showing a message to the user
    }
  };

  //Below is route presentation part!!
  const [plansetwin, setplansetwin] = useState(true);
  const [chatalien, setchatalien] = useState(false);
  const [chatbox, setchatbox] = useState(false);
  const [routedetail, setroutedetail] = useState(false);
  const [ratingwin, setratingwin] = useState(false);
  const [cathover, setcatHover] = useState(false);

  const backtodetailwin = () => {
    setratingwin(false);
  };

  const togglechatbox = () => {
    setchatbox(true);
    setchatalien(false);
  };

  const closechatbox = () => {
    setchatbox(false);
    setchatalien(true);
  };

  const catcloseHover = () => {
    setcatHover(true);
  };

  const catcloseMouseLeave = () => {
    setcatHover(false);
  };



  const toggleratewin = () => {
    setratingwin(true);
    setchatbox(false);
    setchatalien(false);
    setroutedetail(false);
  };

  const handleButtonClick_close = () => {
    navigate("/realmappage");
  };

  const handleRatingsCalc = () => {
    //console.log("Submitted General Walk Rating:", walkRating);
    //console.log("Submitted Waypoint Ratings:", waypointRatings);

    // Define mappings using arrays of tuples and convert them to objects
    const walkRatingModifiers = Object.fromEntries([[0, -0.25], [0.5, -0.2], [1, -0.15], [1.5, -0.15], [2, -0.1], [2.5, -0.1], [3, -0.05], [3.5, -0.05], [4, 0.0], [4.5, 0.05], [5, 0.05], [5.5, 0.1], [6, 0.1], [6.5, 0.15], [7, 0.15], [7.5, 0.2], [8, 0.2], [8.5, 0.25], [9, 0.25], [9.5, 0.3], [10, 0.4]]);
    const ratingModifierMapping = Object.fromEntries([[-5, -0.6], [-4, -0.4], [-3, -0.3], [-2, -0.2], [-1, -0.1], [0, 0], [1, 0.1], [2, 0.2], [3, 0.3], [4, 0.4], [5, 0.6]]);

    const updatedGlobalArray = globalArray.map((node) => {
      // Apply the walkRating modifier to all nodes
      let rating = node.rating + walkRatingModifiers[walkRating];
      // Find the corresponding waypoint in waypointRatings and apply the rating_modifier if exists
      const waypoint = waypointRatings.find((w) => w.id === node.id);
      if (waypoint) {
        rating += ratingModifierMapping[waypoint.rating_modifier];
      }
      // Clamp the rating between 0 and 5
      rating = Math.max(0, Math.min(5, rating));
      return { ...node, rating }; // Update the node with the new rating
    });

    // Send the updated global array to the backend
    axios.post('/users/ratings', updatedGlobalArray)
      .then((response) => {
        console.log('Ratings updated successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error updating ratings:', error);
      });

    // Update globalArray
    setGlobalArrayValue(updatedGlobalArray);
  };

  const handleSubmit = () => {
    handleButtonClick_close(); // Function to close the popup
    handleRatingsCalc(); // Function to process ratings
  };

  const calculateQuietnessScore = () => {
    if (location && "b-score" in location) {
      let totalScore = 0;
      let locationBScores = [];
      let givenTime = inputValues.hour.toString(); // Convert hour to string to match the keys in b-score
      globalArray.forEach(location => {
        let bScore = location["b-score"][givenTime];
        if (bScore != null) {
          locationBScores.push(bScore);
          bScore += 1; // Add 1 to the b-score
          bScore = Math.max(bScore, -2); // Check against the borders
          bScore = Math.min(bScore, 2);
          totalScore += bScore; // Add the b-score to the total score
        }
        //console.log("total quietness score:", totalScore);
      });
      //console.log("location b-scores:", locationBScores);
      const averageScore = totalScore / globalArray.length;
      //console.log('Average Quietness:', averageScore);
      const percentageQuietness = (averageScore / 2) * 100;
      //console.log('Percentage Quietness:', percentageQuietness);
      return percentageQuietness;
    } else {
      return 52+Math.floor(Math.random() * 18);
    }
  };

  const percentageQuietness = calculateQuietnessScore();

  const colourPicker = (percentageQuietness) => {
    let red, green;
    if (percentageQuietness < 50) {
      red = 255;
      green = 5 * percentageQuietness; // Transition from 0 to 255 as percentage goes from 0 to 50
    } else {
      red = 255 - 5 * (percentageQuietness - 40); // Transition from 255 to 0 as percentage goes from 50 to 100
      green = 255;
    }
    return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`;
  };




//为了Mobile新加的
const [hmap, sethmap] = useState(false);
const [mobileshowbut, setmobileshowbut] = useState(false);
const togglehmap = () => {
  sethmap(!hmap);
};

const togglehplan = () => {
  setplansetwin(!plansetwin);
  setratingwin(false);
};

const togglehdetail = () => {
  setroutedetail(!routedetail);
  setchatalien(true);
  setratingwin(false);

};

const togglemplan = () => {
  setplansetwin(!plansetwin);
  setroutedetail(false);
  setmobileshowbut(false);
  setchatalien(false);
  setchatbox(false);
  setratingwin(false);
};

//这个是要改动的
const backtoplanwin = () => {
  setplansetwin(true);
  setchatalien(false);
  setroutedetail(false);
  setchatbox(false);
  setmobileshowbut(false);
};

const toggledetailwin = () => {
  setroutedetail(!routedetail);

  if (ratingwin) {
    setchatalien(true);
    setratingwin(false);
  } else {
    setchatalien(ratingwin => ratingwin ? true : false);
  }
};

const togglecloserate= () => {
  setratingwin(false);
  setchatalien(true);
};

const togglehome = () => {
  navigate("/");
};

  return (
    <div>



      {/* mobile新加的 */}

      <div
        className="heatmap_mobile"
        onClick={togglehmap}
      >
        <HMobiledataIcon sx={{ fontSize: 29, color: "white" }} />
      </div>

      <div
        className="set_mobile"
        onClick={togglemplan}
      >
        <TuneIcon sx={{ fontSize: 23, color: "white" }} />
      </div>

      {mobileshowbut&&(<div
        className="show_mobile"
        onClick={toggledetailwin}
      >
        <RouteIcon sx={{ fontSize: 23, color: "white" }} />
        </div>)}



      {plansetwin && (
        <>
        {/* 这里为了mobile的效果变化了 */}
          <div className="user-input-mobile">
            <div className="titlebox">
              <span className="text_bar-mapfunction">My Journey Planner</span>
              <CloseIcon className="close-hmap" onClick={togglemplan} sx={{ fontSize: 27 , color: 'white'}} />
            </div>
            <div className="when-input">
              <p>When?</p>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="center"
                paddingBottom="10px"
              >
                <Button
                  className="now-button"
                  sx={{ width: "80px", height: "2.2rem" }}
                  variant={nowSelected ? "contained" : "outlined"}
                  style={
                    nowSelected
                      ? { borderRadius: 0 }
                      : {
                        backgroundColor: "transparent",
                        borderColor: "black",
                        color: "black",
                        boxShadow: "none",
                        borderRadius: 0,
                      }
                  }
                  onClick={handleNowButtonClick}
                >
                  Now
                </Button>
                <Button
                  variant={laterSelected ? "contained" : "outlined"}
                  sx={{width: "80px", height: "2.2rem"  }}
                  style={
                    laterSelected
                      ? { borderRadius: 0 }
                      : {
                        borderRadius: 0,
                        backgroundColor: "transparent",
                        borderColor: "black",
                        color: "black",
                        boxShadow: "none",
                      }
                  }
                  onClick={handleLaterButtonClick}
                >
                  Later
                </Button>
              </Stack>
              {showTimeInput && (
                <DateTimePicker
                  // sx={{ width: "100px", height: "2.5rem" }}
                  value={time}
                  onChange={(value) => {
                    if (value) {
                      setTime(value);
                      setInputValues((prevValues) => ({
                        ...prevValues,
                        hour: value.getHours(),
                      }));
                    } else {
                      setTime(initialTime);
                    }
                  }}
                />
              )}
            </div>

            {showDistanceInput && (
              <div>
                <p>How long would like to go for?</p>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <Slider
                    style={{ width: "150px" }}
                    value={sliderValue}
                    min={sliderUnit === "km" ? 1 : 10}
                    max={sliderUnit === "km" ? 10 : 100}
                    step={sliderUnit === "km" ? 0.5 : 5}
                    valueLabelDisplay="auto"
                    onChange={(event, newValue) => {
                      setSliderValue(newValue), handleSliderChange(event);
                    }}
                    onChangeCommitted={() => {
                      setShowBeginLocationInput(true);
                    }}
                  />
                  <Button
                    sx={{ width: "80px", height: "2.2rem"  }}
                    variant="outlined"
                    style={
                      nowSelected
                        ? {
                          borderColor: "black",
                          color: "black",
                          borderRadius: 0,
                        }
                        : {
                          borderColor: "black",
                          color: "black",
                          borderRadius: 0,
                        }
                    }
                    onClick={() => {
                      if (sliderUnit === "km") {
                        // Scale the slider value from the km range to the min range
                        const position = (sliderValue - 1) / (10 - 1);
                        const newValue = position * (100 - 10) + 10;
                        setSliderValue(newValue);
                        setSliderUnit("min");
                      } else {
                        // Scale the slider value from the min range to the km range
                        const position = (sliderValue - 10) / (100 - 10);
                        const newValue = position * (10 - 1) + 1;
                        setSliderValue(newValue);
                        setSliderUnit("km");
                      }
                      handleSliderChange({ target: { value: sliderValue } });
                    }}
                  >
                    {sliderUnit === "km"
                      ? `${sliderValue} km`
                      : `${sliderValue} mins`}
                  </Button>
                </div>
              </div>
            )}

            {showBeginLocationInput && (
              <div>
                <p>Where would you like to begin?</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Stack
                    spacing={1}
                    direction="row"
                    justifyContent="center"
                    paddingBottom="10px"
                  >
                    <Button
                      onClick={() => {
                        setInputValues((prevValues) => ({
                          ...prevValues,
                          latitude: 40.7505,
                          longitude: -73.9934,
                        }));
                        setShowBeginField(false);
                        setHomeSelected(true);
                        setSearchSelected(false);
                        setAddressSelected(false);
                        setShowEndLocationInput(true);
                      }}
                      sx={{ width: "110px", height: "2.2rem"  }}
                      startIcon={<HomeIcon />}
                      variant={homeSelected ? "contained" : "outlined"}
                      style={
                        homeSelected
                          ? { borderRadius: 0 }
                          : {
                            borderRadius: 0,
                            backgroundColor: "transparent",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "none",
                          }
                      }
                    >
                      Home
                    </Button>

                    <Button
                      onClick={() => {
                        setBeginLocationPressed(!beginLocationPressed);
                        setShowBeginField(false);
                        setHomeSelected(false);
                        setSearchSelected(true);
                        setAddressSelected(false);
                      }}
                      sx={{  width: "110px", height: "2.2rem"  }}
                      startIcon={
                        beginLocationPressed ? (
                          <LocationSearchingIcon />
                        ) : (
                          <MapIcon />
                        )
                      }
                      variant={searchSelected ? "contained" : "outlined"}
                      style={
                        searchSelected
                          ? { borderRadius: 0 }
                          : {
                            borderRadius: 0,
                            backgroundColor: "transparent",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "none",
                          }
                      }
                    >
                      {beginLocationPressed ? "Click" : "Map"}
                    </Button>

                    <Button
                      onClick={() => {
                        setShowBeginField(true);
                        setHomeSelected(false);
                        setSearchSelected(false);
                        setAddressSelected(true);
                      }}
                      sx={{  width: "110px", height: "2.2rem"  }}
                      startIcon={<SearchIcon />}
                      variant={addressSelected ? "contained" : "outlined"}
                      style={
                        addressSelected
                          ? { borderRadius: 0 }
                          : {
                            borderRadius: 0,
                            backgroundColor: "transparent",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "none",
                          }
                      }
                    >
                      Search
                    </Button>
                  </Stack>
                </div>
                {showBeginField && (
                  <Autocomplete
                    id="address-input"
                    onFocus={() => setActiveSearchBox("start")}
                    options={suggestions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={() => true === true}
                    style={{
                      width: 350,
                      paddingBottom: "0px",
                      color: "black",
                      borderRadius: 0,
                    }}
                    onInputChange={handlePlaceNameChange}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handlePlaceSelect(newValue);
                        setActiveSearchBox(null);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Type Address"
                        variant="outlined"
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "primary",
                            },
                            "&:hover fieldset": {
                              borderColor: "primary",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "primary",
                            },
                          },
                          "& .MuiFormLabel-root": {
                            color: "primary",
                            "&.Mui-focused": {
                              color: "primary",
                            },
                          },
                          "& .MuiInputBase-root": {
                            color: "primary",
                          },
                          "& .MuiAutocomplete-clearIndicator": {
                            color: "primary",
                          },
                          "& .MuiAutocomplete-popupIndicator": {
                            color: "primary",
                          },
                        }}
                      />
                    )}
                  />
                )}
              </div>
            )}

            {showEndLocationInput && (
              <div>
                <p>Where would you like to go?</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Stack
                    spacing={1}
                    direction="row"
                    justifyContent="center"
                    paddingBottom="10px"
                  >
                    <Button
                      onClick={() => {
                        setInputValues((prevValues) => ({
                          ...prevValues,
                          endLatitude: 40.7505,
                          endLongitude: -73.9934,
                        }));
                        setEndHomeSelected(true);
                        setEndSearchSelected(false);
                        setEndAddressSelected(false);
                        setShowPreferencesInput(true);
                        setShowGoButton(true);
                        setShowEndField(false);
                      }}
                      startIcon={<HomeIcon />}
                      sx={{  width: "110px", height: "2.2rem" }}
                      variant={endHomeSelected ? "contained" : "outlined"}
                      style={
                        endHomeSelected
                          ? { borderRadius: 0 }
                          : {
                            borderRadius: 0,
                            backgroundColor: "transparent",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "none",
                          }
                      }
                    >
                      Home
                    </Button>

                    <Button
                      onClick={() => {
                        setEndLocationPressed(!endLocationPressed);
                        setEndHomeSelected(false);
                        setEndSearchSelected(true);
                        setEndAddressSelected(false);
                        setShowEndField(false);
                      }}
                      sx={{ width: "110px", height: "2.2rem"  }}
                      startIcon={
                        endLocationPressed ? (
                          <LocationSearchingIcon />
                        ) : (
                          <MapIcon />
                        )
                      }
                      variant={endSearchSelected ? "contained" : "outlined"}
                      style={
                        endSearchSelected
                          ? { borderRadius: 0 }
                          : {
                            borderRadius: 0,
                            backgroundColor: "transparent",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "none",
                          }
                      }
                    >
                      {endLocationPressed ? "Click" : "Map"}
                    </Button>

                    <Button
                      onClick={() => {
                        setEndHomeSelected(false);
                        setEndSearchSelected(false);
                        setEndAddressSelected(true);
                        setShowEndField(true);
                      }}
                      sx={{ width: "110px", height: "2.2rem"  }}
                      startIcon={<SearchIcon />}
                      variant={endAddressSelected ? "contained" : "outlined"}
                      style={
                        endAddressSelected
                          ? { borderRadius: 0 }
                          : {
                            backgroundColor: "transparent",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "none",
                            borderRadius: 0,
                          }
                      }
                    >
                      Search
                    </Button>
                  </Stack>
                </div>
                {showEndField && (
                  <Autocomplete
                    id="address-input"
                    onFocus={() => setActiveSearchBox("end")}
                    options={suggestions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={() => true === true}
                    style={{
                      width: 350,
                      paddingBottom: "5px",
                      color: "black",
                      borderRadius: 0,
                    }}
                    onInputChange={handlePlaceNameChange}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handlePlaceSelect(newValue);
                        setActiveSearchBox(null);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Type Address"
                        variant="outlined"
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "primary",
                            },
                            "&:hover fieldset": {
                              borderColor: "primary",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "primary",
                            },
                          },
                          "& .MuiFormLabel-root": {
                            color: "primary",
                            "&.Mui-focused": {
                              color: "primary",
                            },
                          },
                          "& .MuiInputBase-root": {
                            color: "primary",
                          },
                          "& .MuiAutocomplete-clearIndicator": {
                            color: "primary",
                          },
                          "& .MuiAutocomplete-popupIndicator": {
                            color: "primary",
                          },
                        }}
                      />
                    )}
                  />
                )}
              </div>
            )}

            {showPreferencesInput && (
              <div className="preference-box">
                <p>What would you like to see?</p>
                <form onSubmit={handlePreferencesSubmit}>
                  <Select
                    options={options}
                    isMulti='true'
                    value={selectedOptions}
                    onChange={handleSelectChange}
                    styles={customStyles}
                    menuPlacement="top"
                  />
                </form>
              </div>
            )}

            {showGoButton && (
              // <Stack spacing={1} direction="row" justifyContent="center" paddingBottom="15px">
              //   <Button   sx={{ width: "200px", height: "2.5rem" }}  variant="contained" type="submit" size="large" style={{ borderRadius: 0 }} onClick={handleInputSubmit}>GO</Button>
              // </Stack>

              <div>
              <div className="plansetting">
                <div style={{ position: 'relative', display: 'inline-block' }}> {/* Adjusted the container display style */}

                  {showPopup && (
                    <div style={{
                      position: 'absolute',
                      top: 'auto',
                      bottom: '100%',
                      left: '0', // Aligns the left edge of the error message with the container
                      width: '100%', // Makes the error message the same width as the container
                      padding: '10px',
                      marginBottom: '5px',
                      backgroundColor: 'white',
                      border: '1px solid red',
                      borderRadius: '5px',
                      zIndex: 1000,
                      textAlign: 'center', // Centers the text within the error message
                    }}>
                      <span style={{ color: 'red' }}>⚠</span> Route not possible
                    </div>
                  )}
                  <a
                    className={`plansetting-text-web ${showPopup ? 'shake' : ''}`}
                    type="submit"
                    onClick={handleOverallSubmit}
                  >
                    <span>Let's Go!</span>
                  </a>
                </div>
              </div>
              </div>
            )}

            {/* <Button  sx={{ width: "200px", height: "2.5rem" }} style={{ borderRadius: 0 }} variant='outlined' onClick={() => console.log("These were the inputValues:", inputValues)}>Tell me baby...</Button> */}
            {!showGoButton && (
              <span className="detail-text">
                "Tell me more, tell me more..." - Grease, 1978
              </span>
            )}
          </div>
        </>
      )}

      {/* Routeshowing win part */}
      {/* 为了Mobile而改动的！！！ */}
      {routedetail && (
        <>
        
        

          <div className="detailbox-mobile">
            <div className="detail-titlebox">
            <CloseIcon className="close-hmap" onClick={toggledetailwin} sx={{ fontSize: 27 , color: 'white'}} />
              <span className="text_bar-mapfunction-detail">
                My Walk Details
              </span>
            </div>
            <p>Distance or Duration</p>
            {/* <span>{inputValues.distance}{sliderUnit}</span> */}
            <span><strong>{sliderUnit === "km"
              ? `${sliderValue} km`
              : `${sliderValue} mins`}
            </strong></span>
            {/* <p>Preference</p> */}

            <p>Quietness Score</p><br/>
            <div className="quietness-traffic-light" style={{ position: 'relative', display: 'inline-block' }}>
              <CircularProgress
                variant="determinate"
                size="3rem"
                sx={{
                  ".MuiCircularProgress-circle": {
                    stroke: colourPicker(percentageQuietness), // Apply color to the circle stroke
                    fill: `${colourPicker(percentageQuietness)}40`,
                  }
                }}
                value={percentageQuietness}
              />
              <div style={{
                position: 'absolute',
                top: '42%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '1rem', // Adjust font size as needed
              }}><b>
                {Math.round(percentageQuietness)}%</b>
              </div>
            </div>

  {/* 为了Mobile而改动的！！！ */}

            <div className="directionbox-mobile">
              <div className="directionbox-titlebox">
                <span className="text_bar-mapfunction-detail-2">
                  Direction Helper
                </span>
              </div>
              <div className="directiondetail-mobile">
                <ul className="directionswords">
                  {directiondata.map((step, index) => (
                    <span key={index}>
                      <span className="bold-step">
                        {`Step ${index + 1}: `}&nbsp;&nbsp;
                      </span>
                      {`${step.action ? step.action : "Proceed"}${step.road ? ` on ${step.road}` : ""
                        }${step.distance
                          ? ` for ${step.distance.toFixed(0)} meters`
                          : ""
                        }${step.isKeyNode ? " (Arrived at Key Node)" : ""}`}
                      <br />
                    </span>
                  ))}
                </ul>
              </div>
            </div>

            <div className="finishdetail-mobile">
              <a
                className="finishdetail-text-mobile"
                type="submit"
                onClick={toggleratewin}
              >
                <span>Finish My Walk!</span>
              </a>
            </div>
          </div>
        </>
      )}

{/* 为了mobile修改了 */}
      {chatalien && (
        <>
          <img
            src={normalImagePath}
            alt="Normal Image"
            className="alien-robot-mobile"
            onMouseEnter={(e) =>
              e.currentTarget.setAttribute("src", hoverImagePath)
            }
            onMouseLeave={(e) =>
              e.currentTarget.setAttribute("src", normalImagePath)
            }
            onClick={togglechatbox}
          />
        </>
      )}

      {chatbox && (
        <>
          <div className="alienchatbox-mobile" id="chatbox">
            {cathover ? (
              <img
                src="/static/images/chatamble0.png"
                alt="Image"
                className="chat-robot-two"
              />
            ) : (
              <img
                src="/static/images/chatamble1.png"
                alt="Image"
                className="chat-robot-two"
              />
            )}
            <div className="chat-titlebox">
              <div
                className="additional-block-close-chatbox"
                onClick={closechatbox}
                onMouseEnter={catcloseHover}
                onMouseLeave={catcloseMouseLeave}
              >
                <CloseIcon sx={{ fontSize: 27, color: "white" }} />
              </div>
              <span className="text_bar-mapfunction-chat">Chat with Amble</span>
            </div>

            <ChatBox />
          </div>
        </>
      )}

      {/* Ratings Popup for Waypoints*/}
      {/* 为了mobile效果要变动的 */}

      {ratingwin && (
        <div className="ratewin-mobile">
           
{/*             
          <img
            src="/static/images/newyork3.jpg"
            alt="pics"
            className="ratewin-background-mobile"
          ></img>
           */}
         
            

          

           
         
          <div className="General-rate-inform">
          <CloseIcon className='rate-close-mobile' onClick={togglecloserate} sx={{ fontSize: 27, color: "#014e3d" }} />
            <div className="stop-text-mobile">
              <span>Rate Your Walk</span>
            </div>
            <Box
              sx={{
                "& > legend": { mt: 2 },
              }}
            >
              <div className="like-rate">
                <StyledRating
                  name="customized-color"
                  defaultValue={walkRating}
                  onChange={(event, newValue) => setWalkRating(newValue)}
                  getLabelText={(value) =>
                    `${value} Heart${value !== 1 ? "s" : ""}`
                  }
                  precision={0.5}
                  max={10}
                  icon={
                    <FavoriteIcon
                      fontSize="large"
                      sx={{ fontSize: "1.8rem" }}
                    />
                  }
                  emptyIcon={
                    <FavoriteBorderIcon
                      fontSize="large"
                      sx={{ fontSize: "1.8rem" }}
                    />
                  }
                />
              </div>
            </Box>
            <div className="stop-text-mobile">
              <span>How much did you like your stops? </span>
            </div>
            <Ratings setWaypointRatings={setWaypointRatings} />{" "}
            {/* Includes the Ratings component here */}
          </div>
          <div className="finishrate-mobile">
            <a className="finishrate-text-mobile" type="submit" onClick={togglehome}>
              <span>Submit My Review</span>
            </a>
          </div>
        </div>
      )}




{/* Mobile 版本变化的东西 !!!!!!!*/}
      <div ref={mapContainer} className="map-container" />
        {/* Heatmap Checkboxes*/}
        {hmap&&(
       <div className="heatmap-checkboxes-mobile">
        {/* close icon 加入 */}

                <CloseIcon className="close-hmap" onClick={togglehmap} sx={{ fontSize: 27 , color: 'white'}} />
           


            <label>
            Busyness Scores:
              <input
                type="checkbox"
                checked={isHeatmapVisible}
                onChange={handleToggleHeatmap}
              />
            </label>
       
            <label>
              Crime Scores: 
              <input
                type="checkbox"
                checked={isOtherHeatmapVisible}
                onChange={handleToggleOtherHeatmap}
                  />

            </label>
            
          </div>
          )}
        </div>
    //  </div>
  );
};

export default Map_Mobile;
