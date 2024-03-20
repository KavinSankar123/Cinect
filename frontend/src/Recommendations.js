
function Recommendations( {recommendation, getRecommendation} ) {
    return (
        <div>
            <h1>Your Recommendation</h1>
            <p>Insert plot summary, keywords...</p>
            <p>Recommendation: {recommendation}</p>
            <button onClick={getRecommendation}>Get Recommendation</button>
        </div>
    );
}

export default Recommendations;