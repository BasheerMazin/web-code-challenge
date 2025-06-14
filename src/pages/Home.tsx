import { useTableData } from "../hooks/useTableData";
import {
  TableContainer,
  StyledTable,
  TableHeader,
  TableCell,
  SearchInput,
  SaveButton,
} from "../components/StyledComponents";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCell } from "../components/DateCell";
import { getDisplayValue } from "../utils/table";

export default function Home() {
  const { data, editedCells, updateCell, saveChanges, debouncedFilter } =
    useTableData();
  const columns = Object.keys(data[0] || {});
  const dateCells = ["active_from", "active_to", "booking_from", "booking_to"];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TableContainer>
        <SaveButton onClick={saveChanges}>Save Changes</SaveButton>
        <StyledTable>
          <thead>
            <tr>
              {columns.map((column) => (
                <TableHeader key={column}>
                  {column}
                  <SearchInput
                    placeholder={`Search ${column}...`}
                    onChange={(e) => debouncedFilter(column, e.target.value)}
                  />
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <TableCell
                    key={`${rowIndex}-${column}`}
                    isEdited={editedCells.has(`${rowIndex}-${column}`)}
                  >
                    {dateCells.includes(column) ? (
                      <DateCell
                        value={getDisplayValue(row, column)}
                        onChange={(value) =>
                          updateCell(rowIndex, column, value)
                        }
                      />
                    ) : (
                      <input
                        value={getDisplayValue(row, column)}
                        onChange={(e) =>
                          updateCell(rowIndex, column, e.target.value)
                        }
                        style={{
                          border: "none",
                          background: "transparent",
                          width: "100%",
                        }}
                      />
                    )}
                  </TableCell>
                ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
    </LocalizationProvider>
  );
}
