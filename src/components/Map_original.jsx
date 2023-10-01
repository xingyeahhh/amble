import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Marker } from 'mapbox-gl';
import parks from '../json-files/park_locations.json';
import "./Map_original.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import Box from "@mui/material/Box";

const apiKey = import.meta.env.VITE_MAPBOX_API_KEY
mapboxgl.accessToken = apiKey;
// mapboxgl.accessToken = 'pk.eyJ1IjoiZmluYmFyYWxsYW4iLCJhIjoiY2xqY3NtYWN6MjV0ODNqcXhhaTY4aGQxdSJ9.VeVQzxCCtpyP_MeT1CkjOg';

const Map = () => {
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    const newMarkers = parks.data.map((park) => ({
      id: park.id,
      name: park.name,
      latitude: park.location.latitude,
      longitude: park.location.longitude
    }));

    setMarkers(newMarkers);
    console.log(newMarkers);

    map.current.on('load', () => {
      newMarkers.forEach((marker) => {
        const el = document.createElement('div');
        el.className = 'marker';
        new mapboxgl.Marker(el)
          .setLngLat([marker.longitude, marker.latitude])
          .addTo(map.current);
      });
    });
  }, []);

  // useEffect(() => {
  //   if (!map.current) return; // wait for map to initialize
  //   map.current.on('move', () => {
  //     setLng(map.current.getCenter().lng.toFixed(4));
  //     setLat(map.current.getCenter().lat.toFixed(4));
  //     setZoom(map.current.getZoom().toFixed(2));
  //   });
  // });

  // const mapContainer = useRef(null);
  // const map = useRef(null);
  // const [lat, setLat] = useState(40.727872);
  // const [lng, setLng] = useState(-73.993157);
  // const [zoom, setZoom] = useState(12.4);
  // const [markers, setMarkers] = useState([]);

  return (
    <div>
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude NEW: {lat} | Zoom: {zoom}
      </div> */}
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default Map;
