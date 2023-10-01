import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function Preference() {
  return (
    <Autocomplete
      multiple
      limitTags={2}
      id="multiple-limit-tags"
      options={preference_setting}
      getOptionLabel={(option) => option.title}
      
      renderInput={(params) => (
        <TextField {...params} label="Preference" placeholder="Favorites" />
      )}
      sx={{ width: '270px' }}
    />
  );
}
const preference_setting = [
  { title: 'Parks' },
  { title: 'WIFI' },
  { title: 'Bench' },
  { title: 'Cafe' },
  { title: 'Canteen' },
  { title: 'Library' },
  { title: 'Landscape' },
];