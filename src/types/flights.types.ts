export interface Flight {
  departureDate: string;
  destination: string;
  origin: string;
  price: {
    total: string;
  };
  returnDate: string;
}

export interface FlightsResponse {
  data: Flight[];
  dictionaries: {
    locations: {
      [key: string]: {
        detailedName: string;
      };
    };
    currencies: {
      [key: string]: string;
    };
  };
  meta: { currency: string };
}
