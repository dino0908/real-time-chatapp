  import React, { useState, useEffect } from 'react';
  import socket from './socket';
  import axios from 'axios';

  function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
      //call the backend using axios and pass socket.id, let backend retrieve username and return to chat.jsx to display beside message
      try {
        const url = 'http://localhost:8080/api/getUsername';
        axios.get(url, {
          params: {
            socketId: socket.id
          }
        })
        .then((response) => {
          var username = response.data.username;
          setUsername(username);
        })
      } catch(error) {
        console.log(error);
      }
    }, []);

    const handleInputChange = (e) => {
      setNewMessage(e.target.value);
    };

    const handleSendMessage = () => {
      if (newMessage.trim() !== '') {
        setMessages([...messages, { text: newMessage }]);
        setNewMessage('');
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    }

    return (
      <div>
        <div style={{ height: '400px', overflowY: 'hidden', border: '2px solid #ccc' }}>
          {messages.map((message, index) => (
            <div key={index} style={{marginLeft: '20px', marginTop: '20px'}}>{username}: {message.text}</div>
          ))}
        </div>
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            style={{ flex: 1 }}
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    );
  }

  export default Chat;
