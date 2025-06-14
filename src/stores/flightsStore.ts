import { makeAutoObservable } from "mobx";
import { Flight } from "../types/flights.types";
import { fetchFlights, fetchToken } from "../services/flights.service";
import { TableData } from "../types/tableTypes";

class FlightsStore {
  flights: TableData[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setFlights(flights: Flight[]) {
    this.flights = flights.map((flight) => ({
      origin: flight.origin,
      destination: flight.destination,
      price: flight.price,
      departureDate: flight.departureDate,
      returnDate: flight.returnDate,
      type: flight.type,
    }));
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  async searchFlights(origin: string, departureDate?: string) {
    this.setLoading(true);
    this.setError(null);

    try {
      const token = await fetchToken();
      const response = await fetchFlights(token, origin, departureDate);
      this.setFlights(response.data);
    } catch (error) {
      this.setError("Failed to fetch flights");
    } finally {
      this.setLoading(false);
    }
  }
}

export const flightsStore = new FlightsStore();
