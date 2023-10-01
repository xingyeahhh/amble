// useGeocoding.js
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const useGeocoding = (map, startButtonPressed, setStartButtonPressed, endButtonPressed, setEndButtonPressed, inputValues, setInputValues, showBeginLocationInput, setShowBeginLocationInput, showEndLocationInput, setShowEndLocationInput, setShowPreferencesInput, setShowGoButton) => {
  const [location, setLocation] = useState({ lat: null, lng: null, address: '' });

  useEffect(() => {
    if (map) {
      const onClick = (e) => {
        if (startButtonPressed || endButtonPressed) {
          setStartButtonPressed(false);
          setEndButtonPressed(false);
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`)
            .then(response => response.json())
            .then(data => {
              const address = data.features[0]?.place_name || 'Unknown location';
              setLocation({
                lat: e.lngLat.lat,
                lng: e.lngLat.lng,
                address: address
              });
              if (startButtonPressed) {
                setInputValues(prevValues => ({
                  ...prevValues,
                  latitude: e.lngLat.lat,
                  longitude: e.lngLat.lng
                }));
              } else if (endButtonPressed) {
                setInputValues(prevValues => ({
                  ...prevValues,
                  endLatitude: e.lngLat.lat,
                  endLongitude: e.lngLat.lng
                }));
              }
              if (showBeginLocationInput == true && showEndLocationInput == false) {
                setShowEndLocationInput(true);
              } else {
                console.log("showBeginLocationInput is false");
                setShowPreferencesInput(true);
                setShowGoButton(true);
              }
            })
            .catch(error => console.error('Error:', error));
        }
      };

      map.on('click', onClick);

      // Cleanup function
      return () => {
        map.off('click', onClick);
      };
    }
  }, [map, startButtonPressed, endButtonPressed]);

  return { location, setLocation };
};

export default useGeocoding;
