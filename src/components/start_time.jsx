import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import dayjs from 'dayjs';

export default function StartTime() {
 
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer sx={{ width: 270 }} components={['DateTimePicker']}>
        <DateTimePicker
          label="Choose Time"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
