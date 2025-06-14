import { lazy, Suspense } from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";

import LoadingSpinner from "./components/LoadingSpinner";
import Header from "./layouts/Header";
import { Container } from "@mui/material";

export default function App() {
  const HomePage = lazy(() => import("./pages/Home"));
  const NotFoundPage = lazy(() => import("./pages/NotFound"));

  return (
    <BrowserRouter>
      <Header />
      <Container sx={{ py: 13 }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Container>
    </BrowserRouter>
  );
}
