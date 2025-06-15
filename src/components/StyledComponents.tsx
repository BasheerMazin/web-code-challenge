import styled from "@emotion/styled";
import theme from "../theme";

export const TableContainer = styled.div`
  padding: 20px;
  max-width: 100%;
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

export const TableHeader = styled.th`
  background: #f5f5f5;
  padding: 12px 18px;
  text-align: left;
  font-weight: 600;
  border: 1px solid #e0e0e0;
  cursor: grab;
`;

export const TableCell = styled.td<{ isEdited?: boolean; colSpan?: number }>`
  padding: 12px;
  border: 1px solid #e0e0e0;
  background: ${({ isEdited }) => (isEdited ? "#fff9c4" : "inherit")};
  text-align: center;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export const SaveButton = styled.button`
  padding: 10px;
  background: ${theme.palette.primary.main};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  min-width: 9rem;
  font-size: 1rem;
  &:disabled {
    background: #d3d3d3;
  }
`;
