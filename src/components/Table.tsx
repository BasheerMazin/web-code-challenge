import { useState } from "react";
import { Container, TablePagination } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  TableContainer,
  StyledTable,
  TableHeader,
  TableCell,
  SearchInput,
  SaveButton,
  InputCell,
} from "./StyledComponents";
import { DateCell } from "./DateCell";
import {
  formatHeader,
  getDisplayValue,
  cellMinWidthCalculator,
} from "../utils/table";
import { TableData } from "../types/tableTypes";
import { flightsStore } from "../stores/flights.store";

interface TableProps {
  data: TableData[];
  editedCells: Set<string>;
  updateCell: (rowIndex: number, column: string, value: string) => void;
  saveChanges: () => void;
  debouncedFilter: (column: string, value: string) => void;
}

const Table = ({
  data,
  editedCells,
  updateCell,
  saveChanges,
  debouncedFilter,
}: TableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderedColumns, setOrderedColumns] = useState<string[]>(
    Object.keys(data[0] || {}).filter((key) => key !== "originalIndex")
  );

  const dateCells = ["departureDate", "returnDate"];

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const newColumns = Array.from(orderedColumns);
    const [reorderedItem] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, reorderedItem);
    setOrderedColumns(newColumns);
  };

  const hasEmptyCell = data.some((row) =>
    orderedColumns.some((col) => getDisplayValue(row, col).trim() === "")
  );

  return (
    <>
      <TableContainer>
        <StyledTable>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="table-columns" direction="horizontal">
              {(provided) => (
                <thead ref={provided.innerRef} {...provided.droppableProps}>
                  <tr>
                    {orderedColumns.map((column, index) => (
                      <Draggable
                        key={column}
                        draggableId={column}
                        index={index}
                      >
                        {(provided) => (
                          <TableHeader
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            {formatHeader(column) +
                              (column === "price"
                                ? ` (${flightsStore.currency})`
                                : "")}
                            <SearchInput
                              id={column}
                              placeholder={`Search ${formatHeader(column)}`}
                              onChange={(e) => {
                                debouncedFilter(column, e.target.value);
                                if (page) setPage(0);
                              }}
                            />
                          </TableHeader>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tr>
                </thead>
              )}
            </Droppable>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <TableCell colSpan={orderedColumns.length}>
                    <h2>No results</h2>
                  </TableCell>
                </tr>
              ) : (
                data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {orderedColumns.map((column, columnIndex) => (
                        <TableCell
                          key={`${row.originalIndex}-${column}`}
                          isEdited={editedCells.has(
                            `${row.originalIndex}-${column}`
                          )}
                          minWidth={cellMinWidthCalculator(column)}
                          isEmptied={getDisplayValue(row, column).trim() === ""}
                        >
                          {dateCells.includes(column) ? (
                            <DateCell
                              value={getDisplayValue(row, column)}
                              onChange={(value) =>
                                updateCell(row.originalIndex, column, value)
                              }
                            />
                          ) : (
                            <InputCell
                              id={`${rowIndex}-${columnIndex}`}
                              value={getDisplayValue(row, column)}
                              onChange={(e) =>
                                updateCell(
                                  row.originalIndex,
                                  column,
                                  e.target.value
                                )
                              }
                            />
                          )}
                        </TableCell>
                      ))}
                    </tr>
                  ))
              )}
            </tbody>
          </DragDropContext>
        </StyledTable>
      </TableContainer>
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <SaveButton
          onClick={saveChanges}
          disabled={editedCells.size === 0 || hasEmptyCell}
        >
          {hasEmptyCell ? "Fill All Cells" : "Save Changes"}
        </SaveButton>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>
    </>
  );
};

export default Table;
