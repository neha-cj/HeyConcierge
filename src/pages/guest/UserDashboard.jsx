import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/useAuth.jsx";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import "./UserDashboard.css";

const serviceTypes = [
  { type: "Room Cleaning", icon: "🧹" },
  { type: "Laundry", icon: "🧺" },
  { type: "In-room Dining", icon: "🍽️" },
  { type: "Transportation", icon: "🚗" },
  { type: "Wake-up Call", icon: "⏰" },
  { type: "Maintenance", icon: "🔧" },
];

export default function UserDashboard() {
  const { user, logout } = useAuth();

  const [requests, setRequests] = useState([]);
  const [userData, setUserData] = useState(null);

  const [form, setForm] = useState({
    category: serviceTypes[0].type,
    note: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Load user's service requests and data on component mount
  useEffect(() => {
    if (user) {
      loadServiceRequests();
      loadUserData();
    }
  }, [user]);

  const loadServiceRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: false });

      if (error) {
        console.error('Error loading service requests:', error);
        return;
      }

      setRequests(data || []);
    } catch (error) {
      console.error('Error loading service requests:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading user data:', error);
        return;
      }

      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Insert service request into database
      const { data, error } = await supabase
        .from('service_requests')
        .insert([
          {
            user_id: user.id,
            category: form.category,
            note: form.note,
            status: 'Pending'
          }
        ])
        .select();

      if (error) {
        console.error('Error creating service request:', error);
        alert('Failed to submit service request. Please try again.');
        return;
      }

      // Add the new request to the local state
      if (data && data[0]) {
        setRequests([data[0], ...requests]);
      }

      // Reset form
      setForm({
        category: serviceTypes[0].type,
        note: "",
      });

      alert('Service request submitted successfully!');
    } catch (error) {
      console.error('Error submitting service request:', error);
      alert('Failed to submit service request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="user-dashboard-bg">
      <nav className="user-nav">
        <div className="nav-logo">🏨 <span>NestInn</span></div>
        <div>
                     <Link className="profile-btn" to="/user-profile">
             {userData?.full_name || user?.user_metadata?.full_name} ({userData?.room_no || user?.user_metadata?.room_no})
           </Link>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="user-dashboard-container">
        <div className="new-request-card">
          <h3>Request a Service</h3>
          <form onSubmit={handleSubmit}>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {serviceTypes.map((s) => (
                <option key={s.type} value={s.type}>{s.icon} {s.type}</option>
              ))}
            </select>

            <textarea
              placeholder="Add a note (optional)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={2}
            />

            <button disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        <div className="requests-section">
          <h3>My Requests</h3>
          <div className="requests-list">
            {requests.map((r) => (
              <div key={r.id} className={`request-card status-${r.status.toLowerCase()}`}>
                <div className="request-type">
                  {serviceTypes.find(st => st.type === r.category)?.icon} {r.category}
                </div>
                <div className="request-status">{r.status}</div>
                <div className="request-note">{r.note}</div>
                <div className="request-time">
                  Request ID: {r.id}
                </div>
                {r.status === "Pending" && <span className="mock-notif">⏳ Awaiting staff assignment…</span>}
                {r.status === "In Progress" && <span className="mock-notif">🛠️ Staff working on it!</span>}
                {r.status === "Completed" && <span className="mock-notif">✅ Service completed!</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
