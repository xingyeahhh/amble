import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import "./userpref.css";

const options = [
    // { value: 'park', label: 'Parks' },
    { value: 'library_locations', label: 'Libraries' },
    { value: 'worship_locations', label: 'Places of Worship' },
    { value: 'community_locations', label: 'Community Centres' },
    { value: 'museum_art_locations', label: 'Museums & Art Galleries' },
    { value: 'walking_node_locations', label: 'Other Walking Nodes' },
    // { value: 'park_node_locations', label: 'Other Park Nodes' },
  ];

  const UserPreferences = () => {
    const [selectedOptions, setSelectedOptions] = useState([]);
  
    const handleSelectChange = (selected) => {
      setSelectedOptions(selected);
    };
  
    const selectedValues = selectedOptions.map((option) => option.value);

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Selected Values:',selectedValues);
      console.log('Selected Options:',selectedOptions);
      // 
      // Make the POST request
      axios
        .post('/users/preferences', { selectedOptions: selectedValues}) //, headers: {'Content-Type': 'application/x-www-form-urlencoded'}
       
        .then((response) => {
          // Handle successful response
          console.log('Data:',response.data);
          // console.log("Where is the data?");
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
  
    return (
      <div className="preferences-area">
        <h3>Select Amble Preferences</h3>
      <form onSubmit={handleSubmit}>
        <Select
            options={options}
            isMulti='true'
            value={selectedOptions}
            onChange={handleSelectChange}
        />
        <button type="submit" className='submit-button'>Submit</button>
      </form>
      </div>
    );
  };

  export default UserPreferences;