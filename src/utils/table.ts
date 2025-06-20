import { TableData } from "../types/tableTypes";

export const getDisplayValue = (row: TableData, column: string): string => {
  const value = row[column as keyof TableData];

  if (typeof value === "string") {
    return value;
  } else if (typeof value === "object" && value !== null) {
    if (column === "price" && "total" in value) {
      return value.total;
    }
    const objectValues = Object.values(value).map((val) => String(val));
    return objectValues.join(" | ");
  }
  return String(value);
};

export const formatHeader = (text: string) => {
  return text
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const detailedNameFormatter = (name: string): string => {
  return name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export const cellMinWidthCalculator = (column: string): string | null => {
  switch (column) {
    case "price":
      return "8rem";
    case "returnDate":
    case "departureDate":
      return "10rem";
    case "origin":
    case "destination":
      return "15rem";
    default:
      return null;
  }
};
