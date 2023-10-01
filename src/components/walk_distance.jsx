import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";

export default function Distance() {
  const [inputValue, setInputValue] = React.useState("");

  const handleInputChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, ""); // 只保留数字
    setInputValue(numericValue);
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      <div>
        <FormControl sx={{ m: 1, width: 270 }} variant="outlined">
          <OutlinedInput
            id="outlined-adornment-weight"
            value={inputValue}
            onChange={handleInputChange}
            endAdornment={<InputAdornment position="end">meter</InputAdornment>}
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "meter"
            }}
          />
          
        </FormControl>
      </div>
    </Box>
  );
}
