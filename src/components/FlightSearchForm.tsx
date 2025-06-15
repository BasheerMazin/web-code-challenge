import { observer } from "mobx-react-lite";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { flightsStore } from "../stores/flights.store";

interface FormValues {
  origin: string;
  departureDate: Dayjs | null;
}

const validationSchema = Yup.object({
  origin: Yup.string()
    .length(3, "origin must be IATA code")
    .required("Origin city code is required"),
  departureDate: Yup.date().nullable(),
});

const FlightSearchForm = observer(() => {
  const formik = useFormik<FormValues>({
    initialValues: {
      origin: "",
      departureDate: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      await flightsStore.searchFlights(
        values.origin,
        values.departureDate
          ? values.departureDate.format("YYYY-MM-DD")
          : undefined
      );
    },
  });

  const departureDateError =
    formik.touched.departureDate && formik.errors.departureDate;
  const departureDateErrorMessage =
    typeof departureDateError === "string" ? departureDateError : "";

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            px: "1.3rem",
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            fullWidth
            id="origin"
            name="origin"
            label="Origin City Code"
            value={formik.values.origin}
            onChange={formik.handleChange}
            error={formik.touched.origin && Boolean(formik.errors.origin)}
            helperText={formik.touched.origin && formik.errors.origin}
            placeholder="e.g., MAD"
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Departure Date"
              value={formik.values.departureDate}
              onChange={(newValue) => {
                formik.setFieldValue("departureDate", newValue);
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: Boolean(departureDateError),
                  helperText: departureDateErrorMessage,
                },
              }}
            />
          </LocalizationProvider>

          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={flightsStore.loading}
            sx={{
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 600,
              minWidth: "10rem",
              maxHeight: "3.4rem",
            }}
          >
            Search
          </Button>
        </Box>
      </form>
      {flightsStore.error && (
        <Box sx={{ textAlign: "center", color: "red" }}>
          <h4>{flightsStore.error}</h4>
        </Box>
      )}
    </>
  );
});

export default FlightSearchForm;
