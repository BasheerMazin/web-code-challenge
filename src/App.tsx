import { lazy, Suspense } from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";

import LoadingSpinner from "./components/LoadingSpinner";
import Header from "./layouts/Header";
import { Container } from "@mui/material";

export default function App() {
  const HomePage = lazy(() => import("./pages/Home"));

  return (
    <BrowserRouter>
      <Header />
      <Container sx={{ py: 13 }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Suspense>
      </Container>
    </BrowserRouter>
  );
}
