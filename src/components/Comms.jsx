import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import "./Comms.css";
import "./login.css";
import Box from "@mui/material/Box";

function Comms() {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('/users', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log("server responded with error");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
      });
  };

  return (
      <div className="comms">
        <form onSubmit={handleSubmit}>
            <label htmlFor="latitude">Latitude:</label>
            <input
              type="text"
              name="latitude"
              onChange={handleChange}
            />
            <label htmlFor="longitude">Longitude:</label>
            <input
              type="text"
              name="longitude"
              onChange={handleChange}
            />
          <button type="submit">Submit</button>
        </form>
      </div>
  );
}

export default Comms;