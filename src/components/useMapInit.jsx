import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import parks from '../json-files/park_locations.json';
import libraries from '../json-files/library_locations.json';
import communities from '../json-files/community_locations.json';
import museums from '../json-files/museum_art_locations.json';
import worships from '../json-files/worship_locations.json';

const toTitleCase = (str) => {
  if (str === 'null' || str === undefined) return '';
  str = str.replace(/;/g, ' '); // Replace all semicolons with spaces
  return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const useMapInit = (mapContainer, lat, lng, zoom, inputValues, setInputValues) => {
  const map = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [popup, setPopup] = useState(null);

  const startMarkerRef = useRef(); // We use a ref to keep track of the start marker
  const endMarkerRef = useRef(); // We use a ref to keep track of the end marker

  // Track the start location and add a marker on change
  useEffect(() => {
    console.log('useEffect in useMapInit.jsx');
    if (!map.current) return; // If map is not defined, return
    if (startMarkerRef.current) startMarkerRef.current.remove(); // If a start marker already exists, remove it

    // Create a new start marker and add it to the map
    startMarkerRef.current = new mapboxgl.Marker()
      .setLngLat([inputValues.longitude, inputValues.latitude])
      .addTo(map.current);

    console.log('Placing start marker at:', [inputValues.longitude, inputValues.latitude]);
  }, [map, inputValues.latitude, inputValues.longitude]); // This useEffect runs whenever map or start location changes

  // Track the end location and add a marker on change
  useEffect(() => {
    if (!map.current) return; // If map is not defined, return
    if (endMarkerRef.current) endMarkerRef.current.remove(); // If an end marker already exists, remove it

    // Create a new end marker and add it to the map
    endMarkerRef.current = new mapboxgl.Marker()
      .setLngLat([inputValues.endLongitude, inputValues.endLatitude])
      .addTo(map.current);

    console.log('Placing end marker at:', [inputValues.endLongitude, inputValues.endLatitude]);
  }, [map, inputValues.endLatitude, inputValues.endLongitude]); // This useEffect runs whenever map or end location changes

  useEffect(() => {
    const closePopupOnEscape = (e) => {
      if (e.key === 'Escape') {
        popup.remove();
        setPopup(null);
      }
    };

    if (popup) {
      window.addEventListener('keydown', closePopupOnEscape);
    } else {
      window.removeEventListener('keydown', closePopupOnEscape);
    }

    return () => {
      window.removeEventListener('keydown', closePopupOnEscape);
    };
  }, [popup]);


  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    // Function to add markers
    const addMarkers = (data, icon) => {
      const newMarkers = data.map((item) => ({
        id: item.id,
        name: item.name,
        address: item.address,
        internet_access: item.internet_access,
        wheelchair_accessible: item.wheelchair_accessible,
        opening_hours: item.opening_hours,
        latitude: item.location.latitude,
        longitude: item.location.longitude,
      }));

      setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);

      map.current.on('load', () => {
        map.current.loadImage(
          `/static/${icon}.png`,
          (error, image) => {
            if (error) throw error;

            map.current.addImage(icon, image);

            map.current.addSource(icon, {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: newMarkers.map((marker) => ({
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [marker.longitude, marker.latitude],
                  },
                  properties: {
                    id: marker.id,
                    name: marker.name,
                    address: marker.address,
                    internet_access: marker.internet_access,
                    wheelchair_accessible: marker.wheelchair_accessible,
                    opening_hours: marker.opening_hours,
                  },
                })),
              },
            });

            map.current.addLayer({
              id: icon,
              type: 'symbol',
              source: icon,
              layout: {
                'icon-image': icon,
                'icon-size': 0.32,
              },
              paint: {
                'icon-opacity': 0.8,
              },
            });

            map.current.on('mouseenter', icon, () => {
              map.current.getCanvas().style.cursor = 'pointer';
            });

            map.current.on('mouseleave', icon, () => {
              map.current.getCanvas().style.cursor = '';
            });
          }
        );
      });
    };

    // Use the function to add markers for each type of location
    addMarkers(parks.data, 'park');
    addMarkers(libraries.data, 'library');
    addMarkers(communities.data, 'community');
    addMarkers(museums.data, 'museum');
    addMarkers(worships.data, 'worship');

    map.current.on('load', () => {
      // Add the 'click' event listener
      map.current.on('click', (e) => {
        const layers = ['park', 'library', 'community', 'museum', 'worship'];
        const features = map.current.queryRenderedFeatures(e.point, { layers });

        if (features.length > 0 && features[0] !== null && features[0] !== "null" && typeof features[0] !== 'undefined') {
          const coordinates = features[0].geometry.coordinates.slice();
          const { name, id, address, internet_access, wheelchair_accessible, opening_hours } = features[0].properties;
          const popupContent = `<div class="popup-content">
          <h3>${name}</h3>
          <p>
          ${address !== null && address !== 'null' && address !== undefined ? `Address: ${address}<br>` : ''}
          ${internet_access !== null && internet_access !== 'null' && internet_access !== undefined ? `Internet Access: ${toTitleCase(internet_access)}<br>` : ''}
          ${wheelchair_accessible !== null && wheelchair_accessible !== 'null' && wheelchair_accessible !== undefined ? `Wheelchair Accessible: ${toTitleCase(wheelchair_accessible)}<br>` : ''}
          ${opening_hours !== null && opening_hours !== 'null' && opening_hours !== undefined ? `Opening Hours: ${opening_hours}<br>` : ''}
          </p>
        </div>`;

          const popup = new mapboxgl.Popup({ className: 'custom-popup' })
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map.current);
          setPopup(popup);
        }
      });

      setInputValues((prevValues) => ({
        ...prevValues,
        latitude: 0,
        longitude: 0,
      }));

      setInputValues((prevValues) => ({
        ...prevValues,
        endLatitude: 0,
        endLongitude: 0,
      }));

    });
  }, []);

  return { map, markers };
};

export default useMapInit;
