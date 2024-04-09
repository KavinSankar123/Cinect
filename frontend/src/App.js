import React, { useState } from "react";
import Filters from "./Filters.js";
import Recommendations from "./Recommendations.js";
import "./App.css";
import Grid from "@mui/material/Grid";

function App() {
  const [recommendation, setRecommendation] = useState("");
  const [users, setUsers] = useState([]);
  const [poster, setPoster] = useState("");

  function addUser(user) {
    if (user == "") return;
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

  function getRecommendation() {
    const dict = {
      users: users,
      genres: [],
      streaming_platforms: [],
      start_year: 1900,
      end_year: 2024,
    };
    console.log(JSON.stringify(dict));
    fetch("/getRecommendation?data=" + JSON.stringify(dict))
      .then((res) => res.json())
      .then((data) => {
        const recommendation = data.response;
        fetch(`https://www.omdbapi.com/?t=${recommendation}&apikey=f9a2d5c8`)
          .then((res) => res.json())
          .then((data) => {
            const newPoster = data["Poster"];
            console.log(newPoster);
            setRecommendation(recommendation);
            setPoster(newPoster);
          }, []);
      }, []);
  }

  return (
    <Grid container spacing={2} direction="row">
      <Grid item xs={6}>
        <Filters users={users} addUser={addUser} />
      </Grid>
      <Grid item xs={6}>
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
