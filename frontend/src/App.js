import React, { useState, useEffect, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Filters from "./Filters.js";
import Recommendations from "./Recommendations.js";
import { Box } from "@mui/material";
import { getDominantColor } from "./dominantColor";

const theme = createTheme({
  palette: {
    primary: {
      main: "#996515", // gold color for buttons
    },
    text: {
      primary: "#ffffff", // white text
      secondary: "#ffffff",
    },
    background: {
      default: "#000000", // default background
      paper: "rgba(0, 0, 0, 0.2)", // box backgrounds with 20% opacity
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          input: {
            color: "#ffffff", // text fields default to white
          },
          "& label.Mui-focused": {
            color: "#ffffff", // label color when the text field is focused
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#ffffff", // border color when the text field is not focused
            },
            "&.Mui-focused fieldset": {
              borderColor: "#996515", // border color when the text field is focused
            },
          },
        },
      },
    },
  },
});

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [recommendation, setRecommendation] = useState("");
  const [users, setUsers] = useState([]);
  const [poster, setPoster] = useState("");
  const [genres, setGenres] = useState([]);
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const canvasRef = useRef(null);

  function addUser(user) {
    if (user === "") return;
    let validUrl;
    fetch("/verifyUser?user=" + user)
      .then((res) => res.json())
      .then((data) => {
        validUrl = data.response;
        if (!validUrl) return;
        const newUsers = [...users, user];
        setUsers(newUsers);
      }, []);
  }

  function addGenre(genre) {
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

  function getRecommendation() {
    const dict = {
      users: users,
      genres: genres,
      start_year: minYear,
      end_year: maxYear,
    };
    console.log(JSON.stringify(dict));
    fetch("/getRecommendation?data=" + JSON.stringify(dict))
      .then((res) => res.json())
      .then((data) => {
        const recommendations = data.response;
        const bestRec = recommendations[0];
        fetch(`https://www.omdbapi.com/?t=${bestRec}&apikey=f9a2d5c8`)
          .then((res) => res.json())
          .then((data) => {
            const newPoster = data["Poster"];
            console.log(newPoster);
            setRecommendation(bestRec);
            setRecommendations(recommendations);
            setPoster(newPoster);
          }, []);
      }, []);
  }

  const [theme, setTheme] = useState(
    createTheme({
      palette: {
        primary: {
          main: "#996515",
        },
        text: {
          primary: "#ffffff",
          secondary: "#ffffff",
        },
        background: {
          default: "#000000",
          paper: "rgba(0, 0, 0, 0.2)",
        },
      },
    })
  );

  useEffect(() => {
    if (poster) {
      setBgImage(`url(${poster})`);
      getDominantColor(canvasRef.current, poster, (color) => {
        setTheme(
          createTheme({
            palette: {
              primary: {
                main: color,
              },
              text: {
                primary: "#ffffff",
                secondary: "#ffffff",
              },
              background: {
                default: "#000000",
                paper: "rgba(0, 0, 0, 0.2)",
              },
            },
          })
        );
      });
    } else {
      setBgImage(`url(https://images8.alphacoders.com/131/1314205.jpeg)`);
      getDominantColor(
        canvasRef.current,
        "url(https://images8.alphacoders.com/131/1314205.jpeg)",
        (color) => {
          setTheme(
            createTheme({
              palette: {
                primary: {
                  main: color,
                },
                text: {
                  primary: "#ffffff",
                  secondary: "#ffffff",
                },
                background: {
                  default: "#000000",
                  paper: "rgba(0, 0, 0, 0.2)",
                },
              },
            })
          );
        }
      );
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
        {/* Only one Box for recommendations needed */}
        <Recommendations
          getRecommendation={getRecommendation}
          recommendation={recommendation}
          poster={poster}
        />
        {/* Filters at the bottom */}
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
