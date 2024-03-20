import React, { useState, useEffect } from 'react';
import Filters from './Filters.js';
import Recommendations from './Recommendations.js';
import logo from './logo.svg';
import './App.css';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

function App() {
  const [recommendation, setRecommendation] = useState("");
  const [users, setUsers] = useState([]);

  function addUser(user) {
    if (user == "") return;
    let validUrl;
    fetch('/verifyUser?user=' + user).then(res => res.json()).then(data => {
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
      end_year: 2024
    };
    console.log(JSON.stringify(dict));
    fetch('/getRecommendation?data=' + JSON.stringify(dict)).then(res => res.json()).then(data => {
      setRecommendation(data.response);
    }, []);
  }

  return (
    <Grid container spacing={2} direction="row">
      <Grid item xs={6}>
        <Filters users={users} addUser={addUser} />
      </Grid>
      <Grid item xs={6}>
        <Recommendations getRecommendation={getRecommendation} recommendation={recommendation} />
      </Grid>
    </Grid>
  );
}

export default App;