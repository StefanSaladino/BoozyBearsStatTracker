import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true,            // Needed when using sessions/cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
