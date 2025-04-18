import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // Change to your actual API base URL
  withCredentials: true,            // Needed if you're using sessions/cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
