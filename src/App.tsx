import { Route, Routes } from "react-router";

import HomePage from "./pages/HomePage";
import SystemPage from "./pages/SystemPage";

export default function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="system" element={<SystemPage />} />
    </Routes>
  );
}
