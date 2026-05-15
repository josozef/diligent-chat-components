import { Route, Routes } from "react-router";

import HubPage from "./pages/HubPage";
import SystemPage from "./pages/SystemPage";
import GovernanceChatPage from "./pages/governance-chat/GovernanceChatPage";
import CorpSecCommandCenter from "./pages/corpsec/CorpSecCommandCenter";
import AllChatsPage from "./pages/corpsec/AllChatsPage";
import NewChatPage from "./pages/corpsec/NewChatPage";
import NewWorkflowPage from "./pages/corpsec/NewWorkflowPage";
import WorkflowHistoryPage from "./pages/corpsec/WorkflowHistoryPage";
import AppointmentWorkspace from "./pages/corpsec/appointment/AppointmentWorkspace";
import ConversationalAppointmentWorkspace from "./pages/corpsec/appointment/conversation/ConversationalAppointmentWorkspace";
import CisoCommandCenter from "./pages/ciso/CisoCommandCenter";
import InvestigateWorkspace from "./pages/ciso/investigate/InvestigateWorkspace";
import AuditCommandCenter from "./pages/audit/AuditCommandCenter";
import AssuranceReportWorkspace from "./pages/audit/assurance/AssuranceReportWorkspace";

export default function App() {
  return (
    <Routes>
      <Route index element={<HubPage />} />
      <Route path="system" element={<SystemPage />} />
      <Route path="governance-chat" element={<GovernanceChatPage />} />
      <Route path="corpsec" element={<CorpSecCommandCenter />} />
      <Route path="corpsec/chats" element={<AllChatsPage />} />
      <Route path="corpsec/chats/:chatId" element={<NewChatPage />} />
      <Route path="corpsec/workflows" element={<WorkflowHistoryPage />} />
      <Route path="corpsec/workflows/new" element={<NewWorkflowPage />} />
      <Route path="corpsec/appointment" element={<AppointmentWorkspace />} />
      <Route
        path="corpsec/appointment/conversation"
        element={<ConversationalAppointmentWorkspace />}
      />
      <Route path="ciso" element={<CisoCommandCenter />} />
      <Route path="ciso/investigate" element={<InvestigateWorkspace />} />
      <Route path="audit" element={<AuditCommandCenter />} />
      <Route path="audit/assurance" element={<AssuranceReportWorkspace />} />
    </Routes>
  );
}
