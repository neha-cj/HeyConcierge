import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
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

  const [form, setForm] = useState({
    type: serviceTypes[0].type,
    note: "",
    date: "",
    time: "",
    priority: "Medium",
  });

  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const formattedDateTime = new Date().toLocaleString("sv-SE", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      }).replace(",", "");

      const newRequest = {
        id: Math.random(),
        type: form.type,
        status: "Pending",
        note: form.note,
        date: form.date,
        time: form.time,
        priority: form.priority,
        createdAt: formattedDateTime,
        userEmail: user?.email,
      };

      setRequests([newRequest, ...requests]);

      setForm({
        type: serviceTypes[0].type,
        note: "",
        date: "",
        time: "",
        priority: "Medium",
      });

      setSubmitting(false);
    }, 600);
  }

  return (
    <div className="user-dashboard-bg">
      <nav className="user-nav">
        <div className="nav-logo">🏨 <span>NestInn</span></div>
        <div>
          <Link className="profile-btn" to="/user-profile">
            {user?.name} ({user?.room})
          </Link>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="user-dashboard-container">
        <div className="new-request-card">
          <h3>Request a Service</h3>
          <form onSubmit={handleSubmit}>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
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

            <label>Select Date:</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />

            <label>Select Time:</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
            />

            <label>Priority:</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <button disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        <div className="requests-section">
          <h3>My Requests</h3>
          <div className="requests-list">
            {requests
              .filter(r => r.userEmail === user?.email)
              .map((r) => (
                <div key={r.id} className={`request-card status-${r.status.toLowerCase()}`}>
                  <div className="request-type">
                    {serviceTypes.find(st => st.type === r.type)?.icon} {r.type}
                  </div>
                  <div className="request-status">{r.status}</div>
                  <div className="request-note">{r.note}</div>
                  <div className="request-datetime">📅 {r.date} 🕒 {r.time}</div>
                  <div className="request-priority">🚨 Priority: <strong>{r.priority}</strong></div>
                  <div className="request-time">{r.createdAt}</div>
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
