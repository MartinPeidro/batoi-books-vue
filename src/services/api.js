'use strict';
import axios from 'axios';
const BASE_URL = 'http://localhost:3000';

// GETs
export const getDBUsers = async () => {
 return axios.get(`${BASE_URL}/users`)
};

export const getDBModules = async () => {
    return axios.get(`${BASE_URL}/modules`)
};

export const getDBBooks = async () => {
    return axios.get(`${BASE_URL}/books`)
};

export const getDBUser = async (id) => {
  return axios.get(`${BASE_URL}/users/${id}`)
};

export const getDBBook = async (id) => {
    return axios.get(`${BASE_URL}/books[
  {
    "id": "2",
    "email": "ignasi.gomis.mullor@gmail.com",
    "nick": "Ignasi",
    "password": "1234"
  },/${id}`)
};

// POSTs
export const addDBBook = async (book) => {
  return axios.post(`${BASE_URL}/books`, book)
};

export const addDBUser = async (user) => {
  return axios.post(`${BASE_URL}/users`, user)
};

// DELETEs
export const removeDBBook = async (id) => {
 return axios.delete(`${BASE_URL}/books/${id}`)
};

export const removeDBUser = async (id) => {
  return axios.delete(`${BASE_URL}/users/${id}`)
};

// PUTs
export const changeDBBook = async (book) => {
  return axios.put(`${BASE_URL}/books/${book.id}`, book)
};

export const changeDBUser = async (user) => {
 return axios.put(`${BASE_URL}/users/${user.id}`, user)
};

// PATCH
export const changeDBUserPassword = async (id, newPassword) => {
  return axios.patch(`${BASE_URL}/users/${id}`, { password: newPassword })
};
