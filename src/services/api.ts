import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.coincap.io/v2'
});

const exchangeApi = axios.create({
  baseURL: 'https://api.exchangerate-api.com/v4/latest'
});

export const getAssets = async (limit = 50) => {
  const response = await api.get(`/assets?limit=${limit}`);
  return response.data.data;
};

export const getAssetHistory = async (id: string) => {
  const response = await api.get(`/assets/${id}/history?interval=d1`);
  return response.data.data;
};

export const getAssetDetails = async (id: string) => {
  const response = await api.get(`/assets/${id}`);
  return response.data.data;
};

export const getBrlRate = async () => {
  const response = await exchangeApi.get('/USD');
  return response.data.rates.BRL;
};