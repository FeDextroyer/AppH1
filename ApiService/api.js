import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.107.197.193:3000'
});

export default api;