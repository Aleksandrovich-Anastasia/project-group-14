import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://furniture-store.b.goit.study/api',
  timeout: 5000,
});
