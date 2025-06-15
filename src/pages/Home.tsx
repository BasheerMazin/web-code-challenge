import { observer } from "mobx-react-lite";
import FlightSearchForm from "../components/FlightSearchForm";
import Table from "../components/Table";
import { flightsStore } from "../stores/flights.store";
import { useTableData } from "../hooks/useTableData";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = observer(() => {
  const { data, editedCells, updateCell, saveChanges, debouncedFilter } =
    useTableData();
  const { loading, error } = flightsStore;

  return (
    <>
      <FlightSearchForm />
      {loading ? (
        <LoadingSpinner />
      ) : !error ? (
        <Table
          data={data}
          editedCells={editedCells}
          updateCell={updateCell}
          saveChanges={saveChanges}
          debouncedFilter={debouncedFilter}
        />
      ) : (
        <></>
      )}
    </>
  );
});

export default Home;
