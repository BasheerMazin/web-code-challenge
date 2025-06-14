import { observer } from "mobx-react-lite";
import FlightSearchForm from "../components/FlightSearchForm";
import Table from "../components/Table";
import { flightsStore } from "../stores/flights.store";
import { useTableData } from "../hooks/useTableData";

const Home = observer(() => {
  const { data, editedCells, updateCell, saveChanges, debouncedFilter } =
    useTableData();
  const { loading } = flightsStore;

  return (
    <>
      <FlightSearchForm />
      <Table
        data={data}
        editedCells={editedCells}
        loading={loading}
        updateCell={updateCell}
        saveChanges={saveChanges}
        debouncedFilter={debouncedFilter}
      />
    </>
  );
});

export default Home;
