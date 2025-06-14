import { useState, useEffect, useMemo } from "react";
import { TableData } from "../types/tableTypes";
import debounce from "lodash/debounce";
import { fetchFlights, fetchToken } from "../services/flights.service";

export const useTableData = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [editedCells, setEditedCells] = useState<Set<string>>(new Set());
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const fetchFlightsData = async () => {
      const token = await fetchToken();
      const result = await fetchFlights(token, "MAD");
      setTableData(result.data as TableData[]);
    };
    fetchFlightsData();
  }, []);

  const saveChanges = () => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
    setEditedCells(new Set());
  };

  const updateCell = (rowIndex: number, columnId: string, value: string) => {
    const newData = [...tableData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnId]: value,
    };
    setTableData(newData);
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
    return tableData.filter((row) => {
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
  }, [tableData, columnFilters]);

  return {
    data: filteredData,
    editedCells,
    updateCell,
    saveChanges,
    debouncedFilter,
  };
};
