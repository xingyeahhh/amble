import { useEffect, useContext } from 'react';
import bScoreData from '../json-files/all_nodes_with_crime_in_bscore.json';
import taxiGeoJSON from '../json-files/taxi.json'; // Replace with the actual path to the taxi.json file
import { ArrayContext, useWaypointsArray } from "../context/ArrayContext";
import { MapInputContext } from '../context/MapInputContext';
import { useMapInput } from '../context/MapInputContext';

const useHeatmap = (map, isHeatmapVisible, isOtherHeatmapVisible) => {
  const { globalArray, setGlobalArrayValue } = useWaypointsArray();
  const { inputValues, setInputValues } = useContext(MapInputContext);
  let hour = inputValues.hour;

  // Prepare GeoJSON data from bScoreData
  const geoJSONData = {
    type: 'FeatureCollection',
    features: taxiGeoJSON.features.map((feature) => {
      const taxiZoneNodes = bScoreData.data.filter((node) => node['taxi-zone'] === feature.properties.id);
      const totalBScoreForHour = taxiZoneNodes.reduce((acc, node) => acc + node['b-score'][hour], 0);
      const averageBScoreForHour = totalBScoreForHour / taxiZoneNodes.length;

      return {
        type: 'Feature',
        properties: {
          'b-score': averageBScoreForHour,
        },
        geometry: feature.geometry,
      };
    }),
  };

  const cScoreGeoJSONData = {
    type: 'FeatureCollection',
    features: taxiGeoJSON.features.map((feature) => {
      const taxiZoneNodes = bScoreData.data.filter((node) => node['taxi-zone'] === feature.properties.id);
      const totalCScore = taxiZoneNodes.reduce((acc, node) => acc + node['c-score'], 0);
      const averageCScore = totalCScore / taxiZoneNodes.length;

      return {
        type: 'Feature',
        properties: {
          'c-score': averageCScore,
        },
        geometry: feature.geometry,
      };
    }),
  };

  useEffect(() => {
    map.current.on('load', () => {
      // Add the taxi.geojson data as a source
      map.current.addSource('taxi-source', {
        type: 'geojson',
        data: taxiGeoJSON,
      });

      // Add the bScoreData as another source
      map.current.addSource('heatmap-source', {
        type: 'geojson',
        data: geoJSONData,
      });

      // Add a layer for the bScoreData heatmap
      map.current.addLayer({
        id: 'b-score-layer',
        type: 'fill',
        source: 'heatmap-source',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'b-score'],
            0.0,
            '#00684a',
            0.5,
            '#ffff33',
            1.0,
            '#ff0000',
          ],
          'fill-opacity': 0.5,
        },
      });

      // Add c-score heatmap layer to the map
      map.current.addLayer({
        id: 'c-score-layer',
        type: 'fill',
        source: {
          type: 'geojson',
          data: cScoreGeoJSONData,
        },
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'c-score'],
            0,
            '#00684a',
            0.5,
            '#ffff33',
            1,
            '#ff0000',
          ],
          'fill-opacity': 0.5,
        },
      });

      // Add a layer for the edges of taxi zones (black line)
      map.current.addLayer({
        id: 'taxi-zone-edges',
        type: 'line',
        source: 'taxi-source',
        paint: {
          'line-color': 'black', // Color of the outline
          'line-width': 2, // Width of the outline
        },
        filter: ['==', ['get', 'type'], 'taxi-zone'], // Filter to display only taxi zone features
      });
      // Set the initial visibility of the layer
      map.current.setLayoutProperty('b-score-layer', 'visibility', isHeatmapVisible ? 'visible' : 'none');
      map.current.setLayoutProperty('c-score-layer', 'visibility', isOtherHeatmapVisible ? 'visible' : 'none');
    });
  }, [map, isHeatmapVisible, isOtherHeatmapVisible, inputValues.hour]);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Recalculate geoJSONData based on the current hour
    const updatedGeoJSONData = {
      type: 'FeatureCollection',
      features: taxiGeoJSON.features.map((feature) => {
        const taxiZoneNodes = bScoreData.data.filter((node) => node['taxi-zone'] === feature.properties.id);
        const totalBScoreForHour = taxiZoneNodes.reduce((acc, node) => acc + (node['b-score'][inputValues.hour] || 0), 0);
        const averageBScoreForHour = taxiZoneNodes.length ? totalBScoreForHour / taxiZoneNodes.length : 0;

        return {
          type: 'Feature',
          properties: {
            'b-score': averageBScoreForHour,
          },
          geometry: feature.geometry,
        };
      }),
    };

    // Update the heatmap-source with new data
    map.current.getSource('heatmap-source').setData(updatedGeoJSONData);

  }, [inputValues.hour]);


  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      // Handle b-score-layer visibility
      if (map.current.getLayer('b-score-layer')) {
        map.current.setLayoutProperty('b-score-layer', 'visibility', isHeatmapVisible ? 'visible' : 'none');
      }

      // Handle c-score-layer visibility
      if (map.current.getLayer('c-score-layer')) {
        map.current.setLayoutProperty('c-score-layer', 'visibility', isOtherHeatmapVisible ? 'visible' : 'none');
      }

      // Handle taxi-zone-edges visibility
      const shouldDisplayEdges = isHeatmapVisible || isOtherHeatmapVisible;
      map.current.setLayoutProperty('taxi-zone-edges', 'visibility', shouldDisplayEdges ? 'visible' : 'none');
      if (shouldDisplayEdges) {
        map.current.moveLayer('taxi-zone-edges'); // Move the edges to the top
      }
    }
  }, [map, isHeatmapVisible, isOtherHeatmapVisible, inputValues.hour]);

};

export default useHeatmap;
