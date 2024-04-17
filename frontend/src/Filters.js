import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Container,
} from "@mui/material";

// UserFilter sub-component using Material-UI
const UserFilter = ({ addUser }) => {
  const [userInput, setUserInput] = useState("");

  const handleAddUser = () => {
    addUser(userInput);
    setUserInput("");
  };

  return (
    <Box sx={{ mb: 2 }}>
      {" "}
      <TextField
        variant="outlined"
        label="Add User"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Add User"
        fullWidth
        size="small"
        InputProps={{
          style: { color: "white" }, // Make font color white
        }}
        InputLabelProps={{
          style: { color: "white" }, // Make label text color white
        }}
        sx={{
          "& label.Mui-focused": {
            color: "white", // Label color when input is focused
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white", // Border color
            },
            "&:hover fieldset": {
              borderColor: "white", // Border color when hovered
            },
            "&.Mui-focused fieldset": {
              borderColor: "white", // Border color when input is focused
            },
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddUser}
        fullWidth
        sx={{ mt: 1, height: "40px" }} // Consistent margin-top and height
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
  const options = [
    "Action",
    "Adventure",
    "Animation",
    "Children",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Fantasy",
    "Film-Noir",
    "Horror",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ];

  return (
    <Box sx={{ mb: 2 }}>
      {" "}
      {/* Add bottom margin for spacing */}
      <FormControl fullWidth size="small">
        <InputLabel id="genre-select-label">Add Genre</InputLabel>
        <Select
          labelId="genre-select-label"
          id="genre-select"
          value={genreInput}
          label="Add Genre"
          onChange={(e) => setGenreInput(e.target.value)}
          sx={{
            ".MuiSelect-select": { color: "white" }, // Select input text color
            ".MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // Border color
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddGenre}
        fullWidth
        sx={{ mt: 1, height: "40px" }} // Consistent margin-top and height
      >
        Add Genre
      </Button>
    </Box>
  );
};

// Main Filters component using Material-UI Grid
function Filters({ addUser, addGenre }) {
  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 2, paddingX: 2 }}>
      {" "}
      {/* Add horizontal padding */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <UserFilter addUser={addUser} />
        </Grid>
        <Grid item xs={12} md={6}>
          <GenreFilter addGenre={addGenre} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Filters;
