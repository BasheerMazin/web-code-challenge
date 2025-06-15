export interface TableData {
  originalIndex: number;
  departureDate: string;
  destination: string;
  origin: string;
  price: {
    total: string;
  };
  returnDate: string;
}
