import React, { useState } from "react";
import Filters from "./Filters.js";
import Recommendations from "./Recommendations.js";
import "./App.css";
import Grid from "@mui/material/Grid";

function App() {
  const [recommendations, setRecommendations] = useState([])
  const [recommendation, setRecommendation] = useState("");
  const [users, setUsers] = useState([]);
  const [poster, setPoster] = useState("");
  const [genres, setGenres] = useState([]);
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

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

  return (
    <Grid container spacing={2} direction="row">
      <Grid className="left" item xs={6}>
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
      </Grid>
      <Grid className="right" item xs={6}>
        <Recommendations
          getRecommendation={getRecommendation}
          recommendation={recommendation}
          poster={poster}
        />
      </Grid>
    </Grid>
  );
}

export default App;
