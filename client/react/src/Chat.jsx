  import React, { useState, useEffect, useRef } from 'react';
  import socket from './socket';
  import axios from 'axios';

  function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
      //call the backend using axios and pass socket.id, let backend retrieve username and return to chat.jsx to display beside message
      try {
        const url = 'http://3.27.148.53:8080/api/getUsername';
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

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    }
    
    const handleSendMessage = () => {
      if (newMessage.trim() !== '') {
        socket.emit('chat message', { username: username, message: newMessage });
        setMessages([...messages, { username: username, message: newMessage }]);
        setNewMessage('');
      }
    };

    useEffect(() => {
      socket.on('chat message', (data) => {
        if (data.username != username) {
          setMessages([...messages, { username: data.username, message: data.message }]);
        }
      })

      return () => {
        socket.off('chat message');
      };
    }, [messages])


    return (
      <div>
        <div style={{ height: '400px', overflowY: 'auto', border: '2px solid #ccc' }}>
          {messages.map((message, index) => (
            <div key={index} style={{marginLeft: '20px', marginTop: '20px'}}>{message.username}: {message.message}</div>
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
