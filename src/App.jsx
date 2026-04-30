import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import EventsList from './pages/EventsList';
import EventForm from './pages/EventForm';
import AttendeesList from './pages/AttendeesList';
import VenuesList from './pages/VenuesList';
import SponsorsList from './pages/SponsorsList';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/new" element={<EventForm />} />
          <Route path="/events/:id/edit" element={<EventForm />} />
          <Route path="/attendees" element={<AttendeesList />} />
          <Route path="/venues" element={<VenuesList />} />
          <Route path="/sponsors" element={<SponsorsList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
