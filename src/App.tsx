import { Route, Routes } from "react-router";

import HubPage from "./pages/HubPage";
import SystemPage from "./pages/SystemPage";
import GovernanceChatPage from "./pages/governance-chat/GovernanceChatPage";

export default function App() {
  return (
    <Routes>
      <Route index element={<HubPage />} />
      <Route path="system" element={<SystemPage />} />
      <Route path="governance-chat" element={<GovernanceChatPage />} />
    </Routes>
  );
}
