import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://boozybearsstattrackerapi.onrender.com', 
  withCredentials: true,            // Needed when using sessions/cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
