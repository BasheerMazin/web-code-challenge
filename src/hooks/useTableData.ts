import { useState, useEffect, useMemo } from "react";
import { TableData } from "../types/tableTypes";
import debounce from "lodash/debounce";
import { flightsStore } from "../stores/flightsStore";
import { fetchFlights, fetchToken } from "../services/flights.service";

export const useTableData = () => {
  const [editedCells, setEditedCells] = useState<Set<string>>(new Set());
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = await fetchToken();
        const result = await fetchFlights(token, "MAD");
        flightsStore.setFlights(result.data);
      } catch (error) {
        flightsStore.setError("Failed to fetch initial flights");
      }
    };

    fetchInitialData();
  }, []);

  const saveChanges = () => {
    localStorage.setItem("tableData", JSON.stringify(flightsStore.flights));
    setEditedCells(new Set());
  };

  const updateCell = (rowIndex: number, columnId: string, value: string) => {
    const newData = [...flightsStore.flights];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnId]: value,
    };
    flightsStore.setFlights(newData);
    setEditedCells(new Set(editedCells).add(`${rowIndex}-${columnId}`));
  };

  const debouncedFilter = useMemo(
    () =>
      debounce((column: string, value: string) => {
        setColumnFilters((prev) => ({
          ...prev,
          [column]: value,
        }));
      }, 300),
    []
  );

  const filteredData = useMemo(() => {
    return flightsStore.flights.filter((row) => {
      return Object.entries(columnFilters).every(([column, filterValue]) => {
        const value = row[column as keyof TableData];

        if (typeof value === "string") {
          return value.toLowerCase().includes(filterValue.toLowerCase());
        } else if (typeof value === "object" && value !== null) {
          if ("total" in value) {
            return value.total
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          }
          return JSON.stringify(value)
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }

        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [flightsStore.flights, columnFilters]);

  return {
    data: filteredData,
    editedCells,
    updateCell,
    saveChanges,
    debouncedFilter,
  };
};
