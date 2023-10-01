import React, { useState, useEffect, useContext, useRef } from 'react';
import { ArrayContext, useWaypointsArray } from "../context/ArrayContext";
import { MapInputContext, useMapInput } from "../context/MapInputContext";
import axios from 'axios';
import Typist from 'react-typist';
import './ChatBox.css';

//import userIcon from '../../public/images/chat_user.png';
//import acornIcon from '../../public/images/chat_acorn.png';
//import squirrelIcon from '../../public/images/chat_squirrel.png';

function ChatBox() {
    const { globalArray, setGlobalArrayValue, getGlobalArrayItem, addToGlobalArray } = useContext(ArrayContext);
    console.log("globalArray:", globalArray);
    const { inputValues, useMapInput } = useContext(MapInputContext);
    const { latitude, longitude, hour } = inputValues;
    const currentDay = new Date();
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentDay.getDay()];
    
    // uses selected time now
    const [tempTime, setTempTime] = useState([weekday, hour]);
    console.log("time:", tempTime);

    const [message, setMessage] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [suggestionsArray, setSuggestionsArray] = useState([]);
    const [locationFound, setLocationFound] = useState(false);
    const [availableChoices, setAvailableChoices] = useState();
    const [chosenLocation, setChosenLocation] = useState();
    
    const baseOptions = [
        { value: '1', text: "Add a quiet cafe to my walk." },
        { value: '2', text: "Add a quiet restaurant to my walk." },
        { value: '3', text: "Tell me more about a stop on my walk." },
        { value: '4', text: "Find another point of interest along my walk." },
        { value: '5', text: "Give me some advice on walking for my mental health." },
      ];
    
    const initialOptions = ['1', '2', '3', '4', '5'];
    const [allOptions, setAllOptions] = useState(initialOptions);
    // Filter the base options to include only those that are still in allOptions.
    const filteredOptions = baseOptions.filter(baseOption => allOptions.includes(baseOption.value));
    let menuMessage = [
        {
          sender: 'Amble',
          text: "Hi! I'm the Amble assistant. How can I make your walk even better?",
          type: "text",
          stage: "menu",
          value: null
        },
        ...filteredOptions.map(option => ({
          sender: 'Amble',
          text: `\n \t ${option.value}: ${option.text}`,
          type: "clickable",
          stage: "menu",
          value: `${option.value}`
        }))
      ];
    const [messages, setMessages] = useState(menuMessage);

    const backMessage = '\nBack to options.'
    
    const [cafeOption, setCafeOption] = useState(false);
    const [restaurantOption, setRestaurantOption] = useState(false);
    const [stopInfo, setStopInfo] = useState(false);
    const [poiInfo, setPoiInfo] = useState(false);
    const [mentalHealthInfo, setMentalHealthInfo] = useState(false);

    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // This function will be called when an option is selected.
    const selectOption = (selectedOption) => {
        // Remove the selected option from the list of options.
        const newOptions = allOptions.filter(option => option !== selectedOption);
        setAllOptions(newOptions);
    
        // Update the menu messages.
        const filteredOptions = baseOptions.filter(baseOption => newOptions.includes(baseOption.value));
    
        let newMenuMessage;
    
        // Check if there are any more options left
        if (filteredOptions.length === 0) {
            newMenuMessage = [
                {
                    sender: 'Amble',
                    text: "You've explored all the options. You can chat more with the Amble assistant on your next walk!",
                    type: "text",
                    stage: "standard",
                    value: null
                }
            ];
        } else {
            newMenuMessage = [
                {
                    sender: 'Amble',
                    text: "How else can I make your walk even better?",
                    type: "text",
                    stage: "menu",
                    value: null
                },
                ...filteredOptions.map(option => ({
                    sender: 'Amble',
                    text: `\n \t ${option.value}: ${option.text}`,
                    type: "clickable",
                    stage: "menu",
                    value: `${option.value}`
                }))
            ];
        }
        setMessages(newMenuMessage);
    }

    // Helper function for message splitting
    const addMessageToState = (message, sender, type = 'text', stage = 'menu', skip_first = false, value = null) => {
        // Split the message into separate lines
        const messageLines = message.split('\n');
        console.log("messageLines:", messageLines);
        // Filter out empty lines and map each line to a message object
        const newMessages = messageLines
            .filter(line => line.trim() !== '')
            .map((line, index) => ({
                sender,
                text: line,
                type: skip_first && index === 0 ? 'text' : type,  // change type for the first line if skip_first is true
                stage,
                value: value ? value.toString() : (skip_first ? index.toString() : (index + 1).toString())  // convert to string
            }));
        // Add the new messages to the state
        setMessages(prevMessages => [...prevMessages, ...newMessages]);
    };


    // New function for filtering and generating option 3
    const handleStopInfoOptions = (waypoints) => {
        const locations = waypoints.filter(point => point.type !== "walking_node" && point.type !== "park_node");
        if (locations.length > 0) {
            let message = "\n Great choice! For which location would you like extra information?";
            let stopMessage = '';
            for (let i = 0; i < locations.length; i++) {
                stopMessage += `\n Location ${i + 1}: ${locations[i].name}\n`;
            }
            addMessageToState(message, 'Amble', "text", "option 3", false, null);
            addMessageToState(stopMessage, 'Amble', "clickable", "option 3");
            const availableChoices = locations.map((_, index) => `${index + 1}`);
            setAvailableChoices(availableChoices);
            setLocationFound(locations);
        } else {
            let message = "\n I'm sorry, I couldn't find any suitable locations at this time.";
            addMessageToState(message, 'Amble', "text", "option 3", false, null);
        }
    };


    const sendMessage = (e, value = null) => {
        if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
        }
        const first_options = ["1", "2", "3", "4", "5"];
        if (first_options.includes(value) && !cafeOption && !restaurantOption && !stopInfo && !poiInfo && !mentalHealthInfo) {
            let answerPrompt = ''
            if (value === "1") {
                answerPrompt = `\n${value}! Let's go for a coffee.`
                addMessageToState(answerPrompt, 'Me', "text", "option 1", false, null);
                setCafeOption(true);
                setIsTyping(true);
                handleOption(value, globalArray, tempTime, false, null); //backend call for suggestions
            } else if (value === "2") {
                answerPrompt = `\n${value}! Let's go for a meal.`
                addMessageToState(answerPrompt, 'Me', "text", "option 2", false, null);
                setRestaurantOption(true);
                setIsTyping(true);
                handleOption(value, globalArray, tempTime, false, null); //backend call for suggestions
            } else if (value === "3") {
                answerPrompt = `\n${value}! I want to find out more.`
                addMessageToState(answerPrompt, 'Me', "text", "option 3", false, null);
                setStopInfo(true);
                handleStopInfoOptions(globalArray); //reduces API calls to one
            } else if (value === "4") {
                answerPrompt = `\n${value}! I want to explore a little.`
                addMessageToState(answerPrompt, 'Me', "text", "option 4", false, null);
                setPoiInfo(true);
                handleOption(value, globalArray, tempTime, false, null);
            } else if (value === "5") {
                answerPrompt = `\n${value}! I want to take care of my mental health.`
                addMessageToState(answerPrompt, 'Me', "text", "option 5", false, null);
                setMentalHealthInfo(true);
                handleOption(value, globalArray, tempTime, false, null);
            }
            
        } else if (cafeOption) {
            // Handle user response for cafe choice (1)
            const choice = value.toLowerCase().replace('cafe', '').trim();
            if (availableChoices.includes(choice)) {
               setMessages([...messages, 
                { sender: 'Me', text: `Cafe ${choice} sounds great!`, type: 'text', stage: "option 1", value: null},
                { sender: 'Amble', text: `Wonderful! I added this cafe to your walk.`, type: 'text', stage: "option 1", value: null},
                { sender: 'Amble', text: `Enjoy your walk and your coffee!`, type: 'text', stage: "option 1", value: null},
                { sender: 'System', text: 'Back to options.', type: 'clickable', stage: "option 1", value: "1"}
              ]);
              setCafeOption(false); // Reset cafeOption state
              
                // Add cafe to route (globalArray)
                const picked_location = suggestionsArray[parseInt(choice) - 1];
                if (picked_location) {
                const closest_waypoint = picked_location[picked_location.length - 1];
                const new_format = {
                    id: picked_location[0].id, 
                    name: picked_location[0].name,
                    type: "cafe", 
                    address: picked_location[0].address, 
                    location: {latitude: picked_location[0].coordinates.lat, longitude: picked_location[0].coordinates.lng}
                  };

                const index_of_closest_waypoint = globalArray.findIndex(
                    item => item.name === closest_waypoint.name); 
                addToGlobalArray(new_format, index_of_closest_waypoint + 1);   
                }
            }
        } else if (restaurantOption) {
            // Handle user response for restaurant choice (2)
            const choice = value.toLowerCase().replace('restaurant', '').trim();
            if (availableChoices.includes(choice)) {
                setMessages([...messages, 
                    { sender: 'Me', text: `I'd like to go to restaurant ${choice}.`, type: 'text', stage: "option 2", value: null}, 
                    { sender: 'Amble', text: `Wonderful! I added this restaurant to your walk.`, type: 'text', stage: "option 2", value: null},
                    { sender: 'Amble', text: `Enjoy your walk and your meal!`, type: 'text', stage: "option 2", value: null},
                    { sender: 'System', text: 'Back to options.', type: 'clickable', stage: "option 2", value: "2"}
                ]);
                setRestaurantOption(false); // Reset state
                
                // Add cafe to route (globalArray)
                const picked_location = suggestionsArray[parseInt(choice) - 1];
                if (picked_location) {
                const closest_waypoint = picked_location[picked_location.length - 1];
                const new_format = {
                    id: picked_location[0].id, 
                    name: picked_location[0].name,
                    type: "restaurant", 
                    address: picked_location[0].address, 
                    location: {latitude: picked_location[0].coordinates.lat, longitude: picked_location[0].coordinates.lng}
                    };

                const index_of_closest_waypoint = globalArray.findIndex(
                    item => item.name === closest_waypoint.name); 
                addToGlobalArray(new_format, index_of_closest_waypoint + 1);    
                }
            }
        } else if (stopInfo) {
            // Handle user response for stop information choice (3)
            const choice = value.toLowerCase().replace('location ', '').trim();
            if (availableChoices.includes(choice)) {
                setMessages([...messages, { sender: 'Me', text: `Tell me more about location ${choice}.`, type: 'text', stage: "option 3", value: null}]);
                const chosenLocation = locationFound[parseInt(choice) - 1];
                console.log("chosenLocation", chosenLocation);
                handleOption("3", globalArray, tempTime, true, chosenLocation); //backend call for chosen location info
                setStopInfo(false); // Reset state
            }      
        }   else if (poiInfo) {
            // Handle user response for POI information choice (4)
            setPoiInfo(false); // Reset state
        }  else if (mentalHealthInfo) {
            // Handle user response for mental health advice choice (5)
            setMentalHealthInfo(false); // Reset state
        } else {
            setMessages([...messages, { sender: 'Amble', text: "I'm sorry, I didn't understand that. Please choose one of the options by typing the number.", type: 'text', stage: "standard", value: null}]);
        }
        setMessage(""); 
    }

    const handleOption = (option, waypoints, trip_time, ai_call=false, location_choice=null) => {
        axios({
            method: 'post',
            url: '/users/chatbox',
            data: {
                user_choice: option,
                waypoints: waypoints, 
                trip_time: trip_time, 
                ai_call: ai_call,
                location_choice: location_choice,
            }
        })
        .then(response => {
            console.log("response", response);
            if (response && response.data !== null) {
                const data = response.data.data;
                console.log("response.data", response.data);
                if (option === "1" || option === "2") {
                    let newMessage = data[0];
                    const locationFound = data[1];
                    const availableChoices = data[2];
                    const suggestionsArray = data[3];
                
                    if (locationFound == true) { // If locations were found
                        addMessageToState(newMessage, 'Amble', "clickable", `option ${option}`, true);
                        setIsTyping(false);
                        setLocationFound(locationFound);
                        setAvailableChoices(availableChoices);
                        setSuggestionsArray(suggestionsArray);
                      } else { // If no locations were found
                        newMessage = response.data.data;
                        console.log("newMessage:", newMessage);
                        addMessageToState(newMessage, 'Amble', "text", `option ${option}`, false);
                        setIsTyping(false);
                        let addMessage = 'Back to options.';
                        if (option === "1") {
                            addMessageToState(addMessage, 'System', 'clickable', `option ${option}`, false, "1");
                            setCafeOption(false);
                        } else {
                            addMessageToState(addMessage, 'System', 'clickable', `option ${option}`, false, "2");
                            setRestaurantOption(false);
                        }
                    }
                } else if (option == "3") {
                    const newMessage = data;
                    addMessageToState(newMessage, 'Amble', 'text', 'option 3');
                    addMessageToState(backMessage, 'System', 'clickable', 'option 3', false, "3");
                } else if (option === "4") {
                    let newMessage = data[0];
                    const waypoint_sample = data[2][0];
                    addMessageToState(newMessage, 'Amble', 'text', 'option 4');

                    waypoint_sample.forEach((waypoint) => {
                        // find the index of this waypoint in your global waypoints array
                        const waypointIndex = globalArray.findIndex(globalWaypoint => globalWaypoint.id === waypoint.id);
                        if (waypointIndex !== -1) {
                            if (waypoint["name"] != null) {
                                newMessage = `\n It is located close to your stop number ${waypointIndex + 1}, ${waypoint["name"]}.`;
                            } else {
                                newMessage = `\n It is located close to your stop number ${waypointIndex + 1}.`;
                            }
                            addMessageToState(newMessage, 'Amble', 'text', 'option 4');
                        }
                    newMessage = "\n Enjoy your walk and a little exploration!"
                    addMessageToState(newMessage, 'Amble', 'text', 'option 4', false, null);
                    addMessageToState(backMessage, 'System', 'clickable', 'option 4', false, "4");
                    });
                } else if (option === "5") {
                    const adviceMessage = data;
                    addMessageToState(adviceMessage, 'Amble');
                    const addMessage = "\n Every little step on your walk is a great step for your mental health! \n Enjoy your walk!"
                    addMessageToState(addMessage, 'Amble', 'text', 'option 5', false, null);
                    addMessageToState(backMessage, 'System', 'clickable', 'option 4', false, "5");
                    setMentalHealthInfo(false); // Reset state
                }
            } else {
                console.error("Data is null:", response);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
            <div className="ChatBox">
                <div className="messages">
                    {messages.map((message, index) => {
                            if (message.sender === 'System') {
                                return (
                                    <div key={index} className="System-clickable" onClick={() => selectOption(message.value)}>
                                        <p>{message.text}</p>
                                    </div>
                                );
                            } else if (message.sender === 'Me') {
                                return (
                                    <div className="Me">
                                        
                                        <div className="message-container">
                                            <p>{message.text}</p>
                                        </div>
                                    </div>
                                );
                            } else if (message.sender === "Amble") {
                                if (message.type === "clickable") {
                                    return (
                                        <div className="Amble-clickable" onClick={() => sendMessage(null, message.value)}>
                                            
                                            <div className="message-container">
                                                <p>{message.text}</p>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="Amble">
                                            
                                            <div className="message-container">
                                                <p>{message.text}</p>
                                            </div>
                                        </div>
                                    );
                                }
                            }
                        })
                    } 
                    {isTyping && (
                        <Typist className="AmbleTyping">
                            Amble is typing...
                        </Typist>
                    )}
                </div>
            </div>
    );

}

export default ChatBox;