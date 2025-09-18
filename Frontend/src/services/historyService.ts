import axios from 'axios';
import type { History } from '../types';

const API_URL = 'http://localhost:5000/api/history/';

export const saveOutfitHistory = async (outfit: any): Promise<History> => {
  const response = await axios.post(API_URL, { outfit });
  return response.data;
};

export const getOutfitHistory = async (): Promise<History[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const deleteOutfitHistory = async (id: string): Promise<void> => {
  await axios.delete(API_URL + id);
};