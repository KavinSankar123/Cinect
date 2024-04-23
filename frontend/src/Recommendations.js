import React, { useState } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Slider,
  Container,
  CircularProgress,
} from "@mui/material";

const YearFilter = ({ setMinYear, setMaxYear, minYear, maxYear }) => {
  const handleChange = (event, newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2 && newValue.every(val => typeof val === 'number')) {
      setMinYear(newValue[0]);
      setMaxYear(newValue[1]);
    } else {
      console.error("Invalid value for yearRange:", newValue);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Box sx={{ width: "100%", mt: 2 }}>
        <Slider
          value={[minYear, maxYear]}
          onChange={handleChange}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          getAriaValueText={(value) => `${value}`}
          min={1950}  // assuming this is the absolute minimum
          max={2024}  // assuming this is the absolute maximum
          marks
          sx={{ color: "secondary" }} // Slider color
        />
      </Box>
    </Container>
  );
};

function Recommendations({
  recommendation,
  getRecommendation,
  nextRecommendation,
  poster,
  selectedUsers,
  selectedGenres,
  removeUser,
  removeGenre,
  plotSummary,
  actors,
  directors,
  genre,
  rating,
  hasMoreRecommendations,
  setMinYear,
  setMaxYear,
  minYear,
  maxYear
}) {
  const altText =
    poster === "N/A" || poster == null ? "Poster for movie not found" : "";

  const [loading, setLoading] = useState(false); // State to track loading status

  const handleGetRecommendation = async () => {
    setLoading(true); // Start loading
    await getRecommendation(); // Assume getRecommendation is an async function
    setLoading(false); // End loading
  };
  const [yearRange, setYearRange] = useState([1950, 2024]);

  return (
    <Box sx={{ maxWidth: 850, width: "100%" }}>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          style={{ maxWidth: "300px", marginTop: "-300px" }}
        />
      </Box>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Your Recommendation {recommendation ? `- ${recommendation}` : ""}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            <Typography component="span" variant="body2" color="text.secondary">
              Users:
            </Typography>
            {selectedUsers.map((user, index) => (
              <Chip
                key={index}
                label={user}
                variant="outlined"
                onDelete={() => removeUser(user)} // onDelete handler to remove user
                sx={{ color: "white" }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            <Typography component="span" variant="body2" color="text.secondary">
              Genres:
            </Typography>
            {selectedGenres.map((genre, index) => (
              <Chip
                key={index}
                label={genre}
                variant="outlined"
                onDelete={() => removeGenre(genre)} // onDelete handler to remove genre
                sx={{ color: "white" }}
              />
            ))}
          </Box>
          {plotSummary && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Plot Summary: {plotSummary}
            </Typography>
          )}
          {actors && (
            <Typography variant="body2" color="text.secondary">
              Actors: {actors}
            </Typography>
          )}
          {directors && (
            <Typography variant="body2" color="text.secondary">
              Directors: {directors}
            </Typography>
          )}
          {genre && (
            <Typography variant="body2" color="text.secondary">
              Genre: {genre}
            </Typography>
          )}
          {rating && (
            <Typography variant="body2" color="text.secondary">
              Rating: {rating}
            </Typography>
          )}
          {/* Year Range */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Year Range: {minYear} - {maxYear}
            </Typography>
          <YearFilter
            setMinYear={setMinYear}
            setMaxYear={setMaxYear}
            minYear={minYear}
            maxYear={maxYear}
          />{" "}
          <Button
            variant="contained"
            onClick={handleGetRecommendation}
            fullWidth
            disabled={loading} // Disable the button when loading
          >
            {loading ? <CircularProgress size={24} /> : "Get Recommendation"}
          </Button>

          {recommendation && hasMoreRecommendations && (
            <Button
              variant="contained"
              onClick={nextRecommendation}
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Next Recommendation
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Recommendations;
