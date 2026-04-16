import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users';

export const getUsers = () => axios.get(API_URL);
export const getUser = (id) => axios.get(`${API_URL}/${id}`);
export const createUser = (formData) => axios.post(API_URL, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const updateUser = (id, formData) => axios.put(`${API_URL}/${id}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);
