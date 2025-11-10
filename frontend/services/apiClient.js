import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.18:4000'; // dirección base de tu backend

export const apiRequest = (endpoint, method = 'GET', body = null, requiresAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };

  return Promise.resolve()
    .then(() => {
      if (requiresAuth) {
        return AsyncStorage.getItem('token').then((token) => {
          if (token) headers['Authorization'] = `Bearer ${token}`;
        });
      }
    })
    .then(() =>
      fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      })
    )
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
      }
      return response.json().catch(() => null);
    })
    .catch((error) => {
      console.error('Error en la petición:', error.message);
      throw error;
    });
};
