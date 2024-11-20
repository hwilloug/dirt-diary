import axios from 'axios';

const TREFLE_API_TOKEN = '';
const BASE_URL = 'https://trefle.io/api/v1';

export async function searchPlants(query: string) {
  try {
    const response = await axios.get(`${BASE_URL}/plants/search`, {
      params: {
        q: query,
        token: TREFLE_API_TOKEN,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching plants:', error);
    throw error;
  }
}

export async function getPlantDetails(trefleId: number) {
  try {
    const response = await axios.get(`${BASE_URL}/plants/${trefleId}`, {
      params: {
        token: TREFLE_API_TOKEN,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching plant details:', error);
    throw error;
  }
}
