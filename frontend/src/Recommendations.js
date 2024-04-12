import React, { useState } from 'react';
import './App.css';

function Recommendations( {recommendation, getRecommendation, poster} ) {
    const altText = poster === "N/A" || poster == null ? "Poster for movie not found" : "";
    return (
        <div>
            <h1>Your Recommendation</h1>
            <p>Insert plot summary, keywords...</p>
            <p>Recommendation: {recommendation}</p>
            <button onClick={getRecommendation}>Get Recommendation</button>
            <br></br>
            <br></br>
            <img src={poster} alt={altText}></img>
        </div>
    );
}


export default Recommendations;