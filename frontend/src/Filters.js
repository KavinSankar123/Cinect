import React, { useState } from 'react';

function Filters({ users, addUser }) {
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

    return (
        <div>
            <h1>Cinect</h1>
            <p>Generate group movie recommendations using Letterboxd data, streaming service preference, and other filters!</p>
            <ol>{userList}</ol>
            <input type="text" value={user} onChange={handleInputChange} />
            <button onClick={handleAddUser}>Add User</button>
        </div>
    );
}

export default Filters;