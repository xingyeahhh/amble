import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import treeData from '../json-files/new_trees.json'; 
import Papa from 'papaparse'; // 导入 papaparse 库
// import treeDataCSV from '../json-files/new_trees.csv'; 

const MapBackground = ({ zoom }) => {
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoieGluZ3llYWgiLCJhIjoiY2toeWFsOXdsMGE3djJybjBzaGZkdWE2aSJ9.wqzmeUmjmYZiKeW3NGvIiw';

    const map = new mapboxgl.Map({
      container: 'map',
      center: [-73.971321,40.776676],
      zoom: zoom || 10.7,
      style: 'mapbox://styles/xingyeah/clk2yxv5y006s01pg4ws580kw'
    });


    treeData.forEach((tree) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([tree.longitude, tree.Latitude])
        .addTo(map);
    });

      // 使用 papaparse 解析 CSV 文件
      // Papa.parse(treeDataCSV, {
      //   download: true,
      //   header: true,
      //   complete: (result) => {
      //     if (result && result.data) {
      //       result.data.forEach((tree) => {
      //         const marker = new mapboxgl.Marker()
      //           .setLngLat([parseFloat(tree.longitude), parseFloat(tree.Latitude)])
      //           .addTo(map);
      //       });
      //     }
      //   },
      // });

    // map.addControl(new mapboxgl.NavigationControl());
    // Cleanup map instance on component unmount
    
    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ width: '97.5%', height: '97.5%', border: '0px solid #00684a' }} />;

};

export default MapBackground;
