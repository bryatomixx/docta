import { Route, Routes } from 'react-router-dom';
import Login from './routes/Login';
import Dashboard from './routes/Dashboard';
import Inbox from './routes/Inbox';
import CRM from './routes/CRM';
import Leads from './routes/Leads';
import Marketplace from './routes/Marketplace';
import PropertyDetail from './routes/PropertyDetail';
import Automations from './routes/Automations';
import Users from './routes/Users';
import Integrations from './routes/Integrations';
import Enrich from './routes/Enrich';
import { AppShell } from './components/AppShell';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<PropertyDetail />} />
        <Route path="/enrich" element={<Enrich />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/users" element={<Users />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/settings" element={<Integrations />} />
      </Route>
    </Routes>
  );
}
