import { io } from 'socket.io-client';

const socket = io('http://13.211.232.80:8080'); // Replace with your server URL

socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
  });

export default socket;