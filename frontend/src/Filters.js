import React, { useState } from 'react';
//import Slider from 'react-slider';
//import './yearStyles.css'; // Import your CSS file


function Filters({ users, addUser, addGenres, addMinYear, addMaxYear}) {
    //USERS
    const [user, setUser] = useState(""); // State to store the input value

    const handleInputChange = (event) => {
        setUser(event.target.value); // Update the state with the input value
    };

    const handleAddUser = () => {
        addUser(user); // Call the addUser function with the input value
        setUser(""); // Clear the input field after adding the user
    };

    const userList = users.map((user, num) => {
        return (
          <li key={num}>{user}</li>
        );
      });


    //GENRES
    const [genre, setGenre] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
      };
    
      // Function to handle click on an item
      const toggleItem = (item) => {
        if (genre.includes(item)) {
            setGenre(genre.filter((selectedItem) => selectedItem !== item));
        } else {
            addGenres(genre);
            setGenre([...genre, item]);
        }
      };
    
      const handleCheckboxChange = (item) => {
        toggleItem(item);
      };

      const options = [
        'Action', 'Adventure', 'Animation', 'Children', 'Comedy', 'Crime', 
        'Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror', 'Musical',
        'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War',  'Western'
      ];

    //YEARS
    const [minYear, setMinYear] = useState([]);
    const [maxYear, setMaxYear] = useState([]);

    const handleMinChange = (newValues) => {
        setMinYear(newValues.target.value);
        //addMinYear(minYear[0]);
        //setMinYear(newValues);
    }

    const handleUpdateMinYear = () => {
        addMinYear(minYear);
    };

    const handleMaxChange = (newValues) => {
        setMaxYear(newValues.target.value);
    }
    
    const handleUpdateMaxYear = () => {
        addMaxYear(minYear); // Call the addUser function with the input value
    };


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
            
            <button onClick={toggleDropdown} className="dropbtn">Select genres</button>
                {isOpen && (
                    <div className="dropdown-content">
                        {options.map((option, index) => (
                        <div key={index}>
                            <label className="dropdown-item">
                            <input
                                type="checkbox"
                                checked={genre.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                            />
                            {option}
                            </label>
                        </div>
                    ))}
                
                    </div>  
                    
                )}


            <h2>Enter a Range of Years</h2>
                <p>Provide a date range for your recommended movie .</p>
                <label>Released After: </label><input type="text" value={minYear} onChange={handleMinChange} />
                <button onClick={handleUpdateMinYear}>Add lower bound</button>
                <br></br>
                <label>Released Before: </label><input type="text" value={maxYear} onChange={handleMaxChange} />
                <button onClick={handleUpdateMaxYear}>Add Upper bound</button>
                
        </div>
    );
}

export default Filters;
