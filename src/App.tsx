import { Route, Routes } from "react-router";

import HubPage from "./pages/HubPage";
import SystemPage from "./pages/SystemPage";
import GovernanceChatPage from "./pages/governance-chat/GovernanceChatPage";
import CorpSecCommandCenter from "./pages/corpsec/CorpSecCommandCenter";
import AppointmentWorkspace from "./pages/corpsec/appointment/AppointmentWorkspace";
import CisoCommandCenter from "./pages/ciso/CisoCommandCenter";
import InvestigateWorkspace from "./pages/ciso/investigate/InvestigateWorkspace";

export default function App() {
  return (
    <Routes>
      <Route index element={<HubPage />} />
      <Route path="system" element={<SystemPage />} />
      <Route path="governance-chat" element={<GovernanceChatPage />} />
      <Route path="corpsec" element={<CorpSecCommandCenter />} />
      <Route path="corpsec/appointment" element={<AppointmentWorkspace />} />
      <Route path="ciso" element={<CisoCommandCenter />} />
      <Route path="ciso/investigate" element={<InvestigateWorkspace />} />
    </Routes>
  );
}
