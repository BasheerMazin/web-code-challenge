import { makeAutoObservable } from "mobx";
import { Flight, FlightsResponse } from "../types/flights.types";
import { fetchFlights, fetchToken } from "../services/flights.service";
import { TableData } from "../types/tableTypes";
import { detailedNameFormatter } from "../utils/table";

class FlightsStore {
  flights: TableData[] = [];
  loading: boolean = false;
  error: string | null = null;
  dictionaries: FlightsResponse["dictionaries"] | null = null;
  meta: FlightsResponse["meta"] | null = null;
  currency: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setFlights(flights: Flight[]) {
    this.flights = flights.map((flight) => {
      const originLocation = this.dictionaries?.locations?.[flight.origin];
      const destinationLocation =
        this.dictionaries?.locations?.[flight.destination];

      return {
        origin: originLocation
          ? `${flight.origin} - ${detailedNameFormatter(
              originLocation.detailedName
            )}`
          : flight.origin,
        destination: destinationLocation
          ? `${flight.destination} - ${detailedNameFormatter(
              destinationLocation.detailedName
            )}`
          : flight.destination,
        price: flight.price,
        departureDate: flight.departureDate,
        returnDate: flight.returnDate,
      };
    });
  }

  setDictionaries(dictionaries: FlightsResponse["dictionaries"]) {
    this.dictionaries = dictionaries;
  }

  setMeta(meta: FlightsResponse["meta"]) {
    this.meta = meta;
    this.currency = this.meta.currency;
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
      this.setLoading(true);
      const token = await fetchToken();
      const response = await fetchFlights(token, origin, departureDate);
      this.setDictionaries(response.dictionaries);
      this.setMeta(response.meta);
      this.setFlights(response.data);
    } catch (error) {
      this.setError(
        "Failed to search flights, please make sure to fill proper data and try again!"
      );
    } finally {
      this.setLoading(false);
    }
  }
}

export const flightsStore = new FlightsStore();
