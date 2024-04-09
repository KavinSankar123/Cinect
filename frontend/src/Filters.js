import React, { useState } from 'react';
//import Slider from 'react-slider';
//import './yearStyles.css'; // Import your CSS file


function Filters({ users, addUser, genres, addGenre, removeGenre, addMinYear, addMaxYear}) {
    //USERS
    const [user, setUser] = useState(""); // State to store the input value
    const [isOpen, setIsOpen] = useState(false);
    const [minYear, setMinYear] = useState([]);
    const [maxYear, setMaxYear] = useState([]);

    const handleInputChange = (event) => {
        setUser(event.target.value); // Update the state with the input value
    };

    const handleAddUser = () => {
        addUser(user); // Call the addUser function with the input value
        setUser(""); // Clear the input field after adding the user
    };

    const userList = users.map((user, num) => <li key={num}>{user}</li>);


    const options = [
    'Action', 'Adventure', 'Animation', 'Children', 'Comedy', 'Crime', 
    'Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror', 'Musical',
    'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War',  'Western'
    ];

    return (
        <div>
            <h1>Cinect</h1>
            <p>Generate group movie recommendations using Letterboxd data, streaming service preference, and other filters!</p>
            <ol>{userList}</ol>
            <p> Add Users by Letterboxd username. </p>
            <input type="text" value={user} onChange={handleInputChange} />
            <button onClick={handleAddUser}>Add User</button>
            <br></br>
            <br></br>
            
            <button onClick={() => setIsOpen(!isOpen)} className="dropbtn">Select genres</button>
                {isOpen && (
                    <div className="dropdown-content">
                        {options.map((option, index) => (
                        <div key={index}>
                            <label className="dropdown-item">
                            <input
                                type="checkbox"
                                checked={genres.includes(option)}
                                onChange={() => genres.includes(option) ? removeGenre(option) : addGenre(option)}
                            />
                            {option}
                            </label>
                        </div>
                    ))}
                
                    </div>  
                    
                )}


            <h2>Enter a Range of Years</h2>
                <p>Provide a date range for your recommended movie .</p>
                <label>Released After: </label><input type="text" value={minYear} onChange={(newValues) => setMinYear(newValues.target.value)} />
                <button onClick={() => addMinYear(minYear)}>Add lower bound</button>
                <br></br>
                <label>Released Before: </label><input type="text" value={maxYear} onChange={(newValues) => setMaxYear(newValues.target.value)} />
                <button onClick={() => addMaxYear(maxYear)}>Add Upper bound</button>
                
        </div>
    );
}

export default Filters;
