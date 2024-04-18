import React, { useState, useEffect, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Filters from "./Filters.js";
import Recommendations from "./Recommendations.js";
import { Box } from "@mui/material";

function App() {
  const [recommendation, setRecommendation] = useState("");
  const [currentPlotSummary, setPlotSummary] = useState("");
  const [rating, setRating] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [actors, setActors] = useState("");
  const [directors, setDirectors] = useState("");
  const [users, setUsers] = useState([]);
  const [poster, setPoster] = useState("");
  const [genres, setGenres] = useState([]);
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const canvasRef = useRef(null);

  async function addUser(user) {
    if (user === "") return;
    let validUrl;
    console.log("fetching");
    let response = await fetch(
      "https://cinect-api-run-6bhdfkg7yq-ul.a.run.app/verifyUser?user=" + user,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    console.log(response);
    let json = await response.json();
    validUrl = json.response;
    if (!validUrl) return;
    const newUsers = [...users, user];
    setUsers(newUsers);
  }

  function addGenre(genre) {
    if (genres.includes(genre)) return;
    const newGenre = [...genres, genre];
    setGenres(newGenre);
  }

  function removeGenre(genre) {
    const newGenres = genres.filter((gen) => gen !== genre);
    setGenres(newGenres);
  }

  function addMinYear(year) {
    if (year < 1874 || year > 2019) year = 1874;
    const newMin = year;
    setMinYear(newMin);
  }

  function addMaxYear(year) {
    if (year < 1874 || year > 2019) year = 2019;
    const newMax = year;
    setMaxYear(newMax);
  }

  async function getRecommendation() {
    const dict = {
      users: users,
      genres: genres,
      start_year: minYear,
      end_year: maxYear,
    };
    console.log(JSON.stringify(dict));
    let response = await fetch(
      "https://cinect-api-run-6bhdfkg7yq-ul.a.run.app/getRecommendation?data=" + JSON.stringify(dict),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    console.log(response);
    let json = await response.json();
    const recommendations = json.response;
    const bestRec = recommendations[0];
    console.log(bestRec)
    let cleanName = bestRec.replace(/\s+\(\d{4}\)/, "");
    
    fetch(`https://www.omdbapi.com/?t=${cleanName}&apikey=f9a2d5c8`)
      .then((res) => res.json())
      .then((data) => {
        const newPoster = data["Poster"];
        setRecommendation(cleanName);
        setPoster(newPoster);
        setPlotSummary(data["Plot"])
        setActors(data["Actors"])
        setDirectors(data["Director"])
        setYear(data["Year"])
        setRating(data["imdbRating"])
        setGenre(data["Genre"])
      }, []);
  }
  const [theme] = useState(
    createTheme({
      palette: {
        primary: {
          main: "#17202A",
        },
        text: {
          primary: "#ffffff",
          secondary: "#ffffff",
        },
        background: {
          default: "#000000",
          paper: "rgba(0, 0, 0, 0.4)",
        },
      },
    })
  );
const imageURLs = [
  "https://images8.alphacoders.com/131/1314205.jpeg",
  "https://images3.alphacoders.com/135/1358834.jpeg",
  "https://wallpapercave.com/wp/wp5435898.jpg"
];

// Function to select a random image URL from the array
const getRandomImageUrl = () => {
  const randomIndex = Math.floor(Math.random() * imageURLs.length);
  return imageURLs[randomIndex];
};
  useEffect(() => {
    if (poster) {
      setBgImage(`url(${poster})`);
    } else {
      setBgImage(`url(${getRandomImageUrl()})`);
    }
  }, [poster]);
  const [bgImage, setBgImage] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <Box
        sx={{
          flexGrow: 1,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Adjusted for vertical centering
          alignItems: "center",
          backgroundImage: bgImage
            ? `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${bgImage}`
            : "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          transition: "background-image 0.3s", // Smooth transition for background image change
        }}
      >
        <Recommendations
          recommendation={recommendation}
          getRecommendation={getRecommendation}
          poster={poster}
          selectedUsers={users}
          selectedGenres={genres}
          yearRange={[minYear, maxYear]}
          plotSummary={currentPlotSummary}
          actors={actors}
          directors={directors}
          genre={genre}
          rating={rating}
          year={rating}
        />
        <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
          <Filters
            users={users}
            addUser={addUser}
            genres={genres}
            addGenre={addGenre}
            removeGenre={removeGenre}
            minYear={minYear}
            addMinYear={addMinYear}
            maxYear={maxYear}
            addMaxYear={addMaxYear}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
