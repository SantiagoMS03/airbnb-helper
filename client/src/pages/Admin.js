import React, { useState } from 'react';
import axios from 'axios';

function Admin() {
  const [text, setText] = useState('');

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:4000/services/update-bookings', {
          method: 'POST',
          body: text,
        });
      } catch (error) {
        console.error('Error:', error);
        alert(error);
      }
    };

  return (
    <div>
        <h1>Text Input Form</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Enter text:
            {/* <input type="text" value={text} onChange={handleChange} /> */}
            <textarea value={text} onChange={handleChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
    </div>
  );
}

export default Admin;
