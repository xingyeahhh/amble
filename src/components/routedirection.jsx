import { ArrayContext, useWaypointsArray } from '../context/ArrayContext';


import React from 'react'

function routedirection() {
const { globalArray, setGlobalArrayValue } = useWaypointsArray();
console.log(globalArray)

  return (
    <div>
      show nodes:
      {globalArray}
    </div>
  )
}

export default routedirection
