// useRouteDisplay.js
import { useState, useEffect, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { ArrayContext, useWaypointsArray } from '../context/ArrayContext';

//import community_locations from '../json-files/community_locations.json';
//import library_locations from '../json-files/library_locations.json';
//import museum_art_locations from '../json-files/museum_art_locations.json';
//import park_locations from '../json-files/park_locations.json';
//import park_node_locations from '../json-files/park_node_locations.json';
//import walking_node_locations from '../json-files/walking_node_locations.json';
//import worship_locations from '../json-files/worship_locations.json';
import all_nodes from '../json-files/all_nodes.json';

const parseWaypoints = (ways) => {
  return ways.split(";").map((way) => {
    const [longitude, latitude] = way.split(",").map(Number);
    return { latitude, longitude };
  });
};

const matchWaypointsWithData = (waypoints, jsonData) => {
  return waypoints.map((waypoint) => {
    return jsonData.find(
      (data) =>
        data.location.latitude === waypoint.latitude &&
        data.location.longitude === waypoint.longitude
    );
  });
};

const handleWaypoints = (waypointsString, setGlobalArrayValue) => {
  const waypoints = parseWaypoints(waypointsString);
  const jsonData = [
    ...all_nodes.data,
  ];
  const arrayTemp = matchWaypointsWithData(waypoints, jsonData);
  setGlobalArrayValue(arrayTemp);
};

const useRouteDisplay = (map, inputValues) => {

  const { globalArray, setGlobalArrayValue } = useWaypointsArray();
  const [route, setRoute] = useState([]);
  const [directiondata, setdirectiondata] = useState([]); // Initialize with an empty array

  const displayRoute = async () => {
    console.log('displayRoute called');

    if (!map || !inputValues || !inputValues.waypoints || !inputValues.longitude || !inputValues.latitude || !inputValues.endLongitude || !inputValues.endLatitude) return;

    try {
      let waypointsString = "";
      if (inputValues.waypoints.length > 0) {
        waypointsString = inputValues.waypoints
          .map((waypoint) => `${waypoint[1]},${waypoint[0]}`)
          .join(";");
      }

      if (waypointsString) {
        handleWaypoints(waypointsString, setGlobalArrayValue);
      }

      //console.log(inputValues.waypoints)
      //console.log("ways:", waypointsString);

      const callAPI = `https://api.mapbox.com/directions/v5/mapbox/walking/` +
        `${inputValues["longitude"]},` +
        `${inputValues["latitude"]};` +
        `${waypointsString};` +
        `${inputValues["endLongitude"]},` +
        `${inputValues["endLatitude"]}` +
        `?geometries=geojson&steps=true&voice_instructions=true&access_token=${mapboxgl.accessToken}&exclude=ferry`;
      const response = await fetch(callAPI);
      const data = await response.json();

      // Retrieve the route coordinates from the API response
      const routeCoordinates = data.routes[0].geometry.coordinates;

      // Helper function to capitalize the first letter of a string
      const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
      };

      // Extract initial directions
      const initialDirections = data.routes[0].legs.flatMap((leg, legIndex) =>
        leg.steps.map((step, stepIndex) => {
          let action;
          if (step.maneuver.modifier && step.maneuver.type) {
            action = `${step.maneuver.modifier} ${step.maneuver.type}`;
          }

          const hasIntersections = step.intersections && step.intersections.length > 0;
          const hasLocation = hasIntersections && step.intersections[0].location && step.intersections[0].location.originalIndex !== undefined;
          const nodeId = hasLocation ? step.intersections[0].location.originalIndex.toString() : null;
          const nodeIdStr = nodeId !== null ? nodeId.toString() : null;
          const isKeyNode = nodeIdStr !== null ? globalArray && globalArray.some(node => node.id === nodeIdStr) : false;

          return {
            action,
            road: step.name,
            distance: step.distance,
            isKeyNode: isKeyNode
          };
        })
      );

      // Combine directions that are on the same road
      let combinedDirections = [];
      let currentDirection = initialDirections[0];

      for (let i = 1; i < initialDirections.length; i++) {
        const step = initialDirections[i];
        if (currentDirection.road === step.road && step.action && step.action.includes("proceed")) {
          currentDirection.distance += step.distance;
        } else {
          combinedDirections.push(currentDirection);
          currentDirection = step;
        }
      }
      combinedDirections.push(currentDirection);

      // Update actions to be more human-readable
      combinedDirections = combinedDirections.map(step => ({
        ...step,
        action: capitalizeFirstLetter(step.action)
      }));

      // Use `combinedDirections` in your component rendering

      let refinedDirections = [];
      let currentStep = combinedDirections[0];

      for (let i = 1; i < combinedDirections.length; i++) {
        const step = combinedDirections[i];

        // Merge similar steps
        if (currentStep.road === step.road && step.action && step.action.includes("proceed")) {
          currentStep.distance += step.distance;
        } else {
          // Only add steps that aren't too minor (e.g., steps longer than 50 meters or key nodes)
          if (currentStep.distance > 50 || currentStep.isKeyNode) {
            refinedDirections.push(currentStep);
          }
          currentStep = step;
        }
      }

      // Push the last step
      if (currentStep.distance > 50 || currentStep.isKeyNode) {
        refinedDirections.push(currentStep);
      }

      // Simplify language and round distances
      refinedDirections = refinedDirections.map(step => ({
        ...step,
        action: step.action.replace('proceed', 'Go'),
        distance: Math.round(step.distance)
      }));

      // Use `refinedDirections` in your component rendering
      setdirectiondata(refinedDirections);

      // Check that routeCoordinates is an array of valid numbers
      if (!Array.isArray(routeCoordinates) ||
        routeCoordinates.some(coord => coord.length !== 2 || isNaN(coord[0]) || isNaN(coord[1]))) {
        console.error('Invalid route coordinates:', routeCoordinates);
        return;
      }

      // Create a GeoJSON feature with the route coordinates
      const routeGeoJSON = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates,
        },
      };

      // Clear existing map layers (if any)
      if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
      }

      // Add the route layer to the map
      map.addSource('route', {
        type: 'geojson',
        data: routeGeoJSON,
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3b9ddd',
          'line-width': 4,
        },
      });
      setRoute(routeCoordinates);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    displayRoute();
  }, [inputValues.waypoints]);

  useEffect(() => {
    if (map && map.getSource('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    }
  }, [inputValues.latitude, inputValues.longitude, inputValues.endLatitude, inputValues.endLongitude, inputValues.distance, inputValues.hour, map]);


  //console.log("globalArray:", globalArray);
  return { route, displayRoute, directiondata };
};

export default useRouteDisplay;
