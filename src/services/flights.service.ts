import axios from "axios";

import axiosConfig from "../config/Axios.config";
import { FlightsResponse } from "../types/flights.types";

export const fetchToken = async (): Promise<string> => {
  const response = await axios.post(
    `${axiosConfig.API_BASE_URL}/v1/security/oauth2/token`,
    `grant_type=client_credentials&client_id=${axiosConfig.API_KEY}&client_secret=${axiosConfig.API_SECRET}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

export const fetchFlights = async (
  token: string,
  origin: string,
  departureDate?: string
): Promise<FlightsResponse> => {
  const response = await axios.get(
    `${axiosConfig.API_BASE_URL}/v1/shopping/flight-destinations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        origin,
        departureDate: departureDate || undefined,
      },
    }
  );

  return response.data;
};

export default {
  fetchFlights,
  fetchToken,
};
