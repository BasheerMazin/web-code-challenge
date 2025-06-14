const axiosConfig: {
  API_BASE_URL: string;
  API_KEY: string;
  API_SECRET: string;
} = {
  API_BASE_URL: "https://test.api.amadeus.com",
  API_KEY: process.env.REACT_APP_API_KEY || "",
  API_SECRET: process.env.REACT_APP_API_SECRET || "",
};

export default axiosConfig;
