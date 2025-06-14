import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { observer } from "mobx-react-lite";
import { flightsStore } from "../stores/flightsStore";

interface FormValues {
  origin: string;
  departureDate: Dayjs | null;
}

const validationSchema = Yup.object({
  origin: Yup.string().required("Origin city code is required"),
  departureDate: Yup.date().nullable(),
});

const FlightSearchForm: React.FC = observer(() => {
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
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
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
            sx={{ minWidth: "120px" }}
          >
            {flightsStore.loading ? "Searching..." : "Search"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
});

export default FlightSearchForm;
