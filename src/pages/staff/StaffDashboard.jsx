import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./StaffDashboard.css";

const mockRequests = [
  {
    id: 1,
    type: "Room Cleaning",
    status: "Pending",
    room: "210",
    note: "Clean before noon.",
    urgency: "High",
    assigned: null,
    eta: "",
    createdAt: "2025-07-30 09:30",
    user: "John Doe",
  },
  {
    id: 2,
    type: "Laundry",
    status: "In Progress",
    room: "310",
    note: "Extra towels",
    urgency: "Medium",
    assigned: "Jane Smith",
    eta: "20 mins",
    createdAt: "2025-07-30 10:00",
    user: "Emily White",
  },
  {
    id: 3,
    type: "Maintenance",
    status: "Pending",
    room: "410",
    note: "AC not working",
    urgency: "High",
    assigned: null,
    eta: "",
    createdAt: "2025-07-30 11:00",
    user: "Paul Green",
  },
];

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState(mockRequests);
  const [filter, setFilter] = useState({ type: "", status: "", room: "" });

  function takeRequest(id) {
    setRequests(
      requests.map((r) =>
        r.id === id
          ? { ...r, status: "In Progress", assigned: user?.name, eta: "30 mins" }
          : r
      )
    );
  }

  function updateStatus(id, status) {
    setRequests(
      requests.map((r) =>
        r.id === id ? { ...r, status, eta: status === "Completed" ? "" : r.eta } : r
      )
    );
  }

  const filteredRequests = requests.filter(
    (r) =>
      (!filter.type || r.type === filter.type) &&
      (!filter.status || r.status === filter.status) &&
      (!filter.room || r.room === filter.room)
  );

  return (
    <div className="user-dashboard-bg">
      <nav className="user-nav">
        <div className="nav-logo">🧑‍🔧 <span>Staff Desk</span></div>
        <div>
          <span className="profile-btn">{user?.name}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="user-dashboard-container">
        {/* Filter Panel */}
        <div className="new-request-card">
          <h3>Filter Requests</h3>
          <div className="filters-bar">
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="Room Cleaning">Room Cleaning</option>
              <option value="Laundry">Laundry</option>
              <option value="In-room Dining">In-room Dining</option>
              <option value="Transportation">Transportation</option>
              <option value="Wake-up Call">Wake-up Call</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <input
              type="text"
              placeholder="Room #"
              value={filter.room}
              onChange={(e) => setFilter({ ...filter, room: e.target.value })}
              style={{ width: "90px" }}
            />
          </div>
        </div>

        {/* Requests Display */}
        <div className="requests-section">
          <h3>All Requests</h3>
          <div className="requests-list">
            {filteredRequests.map((r) => (
              <div
                key={r.id}
                className={`request-card status-${r.status.toLowerCase().replace(" ", "-")}`}
              >
                <div className="request-type">🛎️ {r.type}</div>
                <div className="request-status">{r.status}</div>
                <div className="request-note">{r.note}</div>
                <div className="request-datetime">📅 {r.createdAt.split(" ")[0]} 🕒 {r.createdAt.split(" ")[1]}</div>
                <div className="request-priority">🚨 Priority: <strong>{r.urgency}</strong></div>
                <div className="request-room">🚪 Room: {r.room}</div>
                <div className="request-user">👤 Guest: {r.user}</div>
                {r.assigned && <div className="assigned-label">🧑‍🔧 Assigned to: {r.assigned}</div>}
                {r.eta && <div className="eta-label">⏱️ ETA: {r.eta}</div>}

                {r.status === "Pending" && <span className="mock-notif">⏳ Awaiting assignment…</span>}
                {r.status === "In Progress" && <span className="mock-notif">🛠️ In progress</span>}
                {r.status === "Completed" && <span className="mock-notif">✅ Completed</span>}

                <div className="actions-bar">
                  {!r.assigned && r.status === "Pending" && (
                    <button className="take-btn" onClick={() => takeRequest(r.id)}>Take Request</button>
                  )}
                  {r.assigned === user?.name && r.status === "In Progress" && (
                    <button className="update-btn" onClick={() => updateStatus(r.id, "Completed")}>Mark Completed</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
