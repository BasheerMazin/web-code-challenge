import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { observer } from "mobx-react-lite";
import FlightSearchForm from "../components/FlightSearchForm";
import {
  TableContainer,
  StyledTable,
  TableHeader,
  TableCell,
  SearchInput,
  SaveButton,
} from "../components/StyledComponents";
import { DateCell } from "../components/DateCell";
import LoadingSpinner from "../components/LoadingSpinner";
import { flightsStore } from "../stores/flightsStore";
import { useTableData } from "../hooks/useTableData";
import { getDisplayValue } from "../utils/table";

const Home: React.FC = observer(() => {
  const { editedCells, updateCell, saveChanges, debouncedFilter } =
    useTableData();
  const { flights, loading } = flightsStore;

  const columns = Object.keys(flights[0] || {});
  const dateCells = ["departureDate", "returnDate"];

  return (
    <>
      <FlightSearchForm />
      <SaveButton onClick={saveChanges} disabled={editedCells.size === 0}>
        Save Changes
      </SaveButton>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TableContainer>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <StyledTable>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <TableHeader key={column}>
                      {column}
                      <SearchInput
                        placeholder={`Search ${column}...`}
                        onChange={(e) =>
                          debouncedFilter(column, e.target.value)
                        }
                      />
                    </TableHeader>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flights.map((row, rowIndex) => (
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
          )}
        </TableContainer>
      </LocalizationProvider>
    </>
  );
});

export default Home;
