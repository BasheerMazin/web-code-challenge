import {
  TableContainer,
  StyledTable,
  TableHeader,
  TableCell,
  SearchInput,
  SaveButton,
} from "./StyledComponents";
import { DateCell } from "./DateCell";
import LoadingSpinner from "./LoadingSpinner";
import { formatHeader, getDisplayValue } from "../utils/table";
import { Container, TablePagination } from "@mui/material";
import { TableData } from "../types/tableTypes";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface TableProps {
  data: TableData[];
  editedCells: Set<string>;
  loading: boolean;
  updateCell: (rowIndex: number, column: string, value: string) => void;
  saveChanges: () => void;
  debouncedFilter: (column: string, value: string) => void;
}

const Table = ({
  data,
  editedCells,
  loading,
  updateCell,
  saveChanges,
  debouncedFilter,
}: TableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderedColumns, setOrderedColumns] = useState<string[]>(
    Object.keys(data[0] || {})
  );

  useEffect(() => {
    setOrderedColumns(Object.keys(data[0] || {}));
  }, [data]);

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

    const items = Array.from(orderedColumns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedColumns(items);
  };

  return (
    <>
      <TableContainer>
        {loading ? (
          <LoadingSpinner />
        ) : (
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
                              {formatHeader(column)}
                              <SearchInput
                                id={column}
                                placeholder={`Search ${formatHeader(column)}`}
                                onChange={(e) =>
                                  debouncedFilter(column, e.target.value)
                                }
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
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {orderedColumns.map((column, columnIndex) => (
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
                              id={`${rowIndex}-${columnIndex}`}
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
            </DragDropContext>
          </StyledTable>
        )}
      </TableContainer>
      {!loading ? (
        <Container sx={{ display: "flex", justifyContent: "space-between" }}>
          <SaveButton onClick={saveChanges} disabled={editedCells.size === 0}>
            Save Changes
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
      ) : (
        <></>
      )}
    </>
  );
};

export default Table;
