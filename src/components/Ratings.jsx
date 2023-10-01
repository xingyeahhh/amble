import React, { useState, useEffect, useContext } from 'react';
import { ArrayContext, useWaypointsArray } from "../context/ArrayContext";
import './Ratings.css'
import Slider from "@mui/material/Slider";

function Ratings({ setWaypointRatings }) {
  const { globalArray } = useContext(ArrayContext);
  const [ ratings, setRatings ] = useState([]);

  // Initialize the ratings
  useEffect(() => {
    const initialRatings = [];
    globalArray
      .filter(item => item.type !== "walking_node" && item.type !== "park_node")
      .forEach(stop => {
        initialRatings.push({ id: stop.id, name: stop.name, type: stop.type, rating: stop.rating, rating_modifier: 0 }); // Default rating
      });
    setRatings(initialRatings);
    console.log("initialRatings:", initialRatings);
  }, [globalArray]);

  // Update the ratings
  const handleRatingChange = (index, value) => {
    const updatedRatings = [...ratings];
    updatedRatings[index].rating_modifier = value;
    console.log("updatedRatings:", updatedRatings);
    setRatings(updatedRatings);
    setWaypointRatings(updatedRatings);
  };

  return (
            <div className="each-stop-inform">
            {ratings.map((stop, index) => (
              <div className="stop-info" key={stop.id}>
                <div className="stand-icon">
                  <img src={`/static/images/${stop.type}_icon.png`} alt={`${stop.type} icon`} style={{ width: '3.5rem', height: '3.5rem' }}/>
                </div>
                <span className='stop-name' >{`STOP ${index + 1}`}</span><br/>
                <span className="park-name">{stop.name}</span><br/>
                <span className="park-name">{`Rating: ${stop.rating}/5`}</span>
                <Slider
                className='rate-slider'
                    aria-label="love-degree"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    step={1}
                    marks={true}
                    min={-5}
                    max={5}
                    onChange={(e, value) => handleRatingChange(index, value)}
                    sx={{ width: "11rem" }}
                  />
                </div>
              ))
            }
          </div>
        )
}

export default Ratings;