import React, { useState } from 'react';
import { Typography, Slider, Box, Button, Grid, TextField } from '@mui/material';

// Helper function to format value label on the slider
const valueLabelFormat = (value) => `${value}`;

// InputField sub-component using Material-UI TextField
const InputField = ({ value, onChange, placeholder }) => (
  <TextField
    variant="outlined"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    size="small"
    fullWidth
    InputProps={{
      style: { color: 'white' },  // Make font color white
    }}
  />
);

// UserFilter sub-component using Material-UI
const UserFilter = ({ addUser }) => {
  const [userInput, setUserInput] = useState("");

  const handleAddUser = () => {
    addUser(userInput);
    setUserInput("");
  };

  return (
    <Box sx={{ mb: 2 }}> {/* Add bottom margin for spacing */}
      <TextField
        variant="outlined"
        label="Add User"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Add User"
        fullWidth
        size="small"
        InputProps={{
          style: { color: 'white' },  // Make font color white
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddUser}
        fullWidth
        sx={{ mt: 1, height: '40px' }}  // Consistent margin-top and height
      >
        Add User
      </Button>
    </Box>
  );
};

const GenreFilter = ({ addGenre }) => {
  const [genreInput, setGenreInput] = useState("");

  const handleAddGenre = () => {
    addGenre(genreInput);
    setGenreInput("");
  };

  return (
    <Box sx={{ mb: 2 }}> {/* Add bottom margin for spacing */}
      <TextField
        variant="outlined"
        label="Add Genre"
        value={genreInput}
        onChange={(e) => setGenreInput(e.target.value)}
        fullWidth
        size="small"
        InputProps={{
          style: { color: 'white' },  // Make font color white
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddGenre}
        fullWidth
        sx={{ mt: 1, height: '40px' }}  // Consistent margin-top and height
      >
        Add Genre
      </Button>
    </Box>
  );
};

const YearFilter = ({ addMinYear, addMaxYear }) => {
  const [yearRange, setYearRange] = useState([1880, 2024]);

  const handleChange = (event, newValue) => {
    setYearRange(newValue);
  };

  const applyYearFilter = () => {
    addMinYear(yearRange[0]);
    addMaxYear(yearRange[1]);
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography gutterBottom>Start Year: {yearRange[0]}</Typography>
      <Typography gutterBottom style={{ textAlign: 'right' }}>
        End Year: {yearRange[1]}
      </Typography>
      <Slider
        value={yearRange}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valueLabelFormat}
        min={1880}
        max={2020}
        marks
        sx={{ color: 'gold' }}  // Slider color
      />
      <Button
        variant="contained"
        color="primary"
        onClick={applyYearFilter}
        fullWidth
        sx={{ mt: 1, height: '40px' }}  // Consistent margin-top and height
      >
        Apply Year Filter
      </Button>
    </Box>
  );
};

// Main Filters component using Material-UI Grid
function Filters({ addUser, addGenre, addMinYear, addMaxYear }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <UserFilter addUser={addUser} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <GenreFilter addGenre={addGenre} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <YearFilter addMinYear={addMinYear} addMaxYear={addMaxYear} />
      </Grid>
    </Grid>
  );
}

export default Filters;
