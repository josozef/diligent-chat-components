import { Route, Routes } from "react-router";

import HubPage from "./pages/HubPage";
import SystemPage from "./pages/SystemPage";
import GovernanceChatPage from "./pages/governance-chat/GovernanceChatPage";
import CorpSecCommandCenter from "./pages/corpsec/CorpSecCommandCenter";
import AppointmentWorkspace from "./pages/corpsec/appointment/AppointmentWorkspace";

export default function App() {
  return (
    <Routes>
      <Route index element={<HubPage />} />
      <Route path="system" element={<SystemPage />} />
      <Route path="governance-chat" element={<GovernanceChatPage />} />
      <Route path="corpsec" element={<CorpSecCommandCenter />} />
      <Route path="corpsec/appointment" element={<AppointmentWorkspace />} />
    </Routes>
  );
}
