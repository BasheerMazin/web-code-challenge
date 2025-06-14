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
