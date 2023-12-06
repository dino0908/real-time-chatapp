import { io } from 'socket.io-client';

const socket = io('http://3.25.177.118:8080'); // Replace with your server URL

socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
  });

export default socket;