import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./AdminDashboard.css";

const mockAnalytics = {
  dailyVolume: 34,
  weeklyVolume: 210,
  avgResolution: "32 mins",
  satisfaction: "92%",
  topStaff: [
    { name: "Jane Smith", completed: 52 },
    { name: "Alex Kim", completed: 49 },
  ],
  barData: [
    { day: "Mon", volume: 32 },
    { day: "Tue", volume: 40 },
    { day: "Wed", volume: 36 },
    { day: "Thu", volume: 30 },
    { day: "Fri", volume: 42 },
    { day: "Sat", volume: 17 },
    { day: "Sun", volume: 13 },
  ],
};

const mockRequests = [
  { id: 1, type: "Room Cleaning", status: "In Progress", staff: "Jane Smith", room: "210", urgency: "High" },
  { id: 2, type: "Laundry", status: "Completed", staff: "Alex Kim", room: "310", urgency: "Medium" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState({ staff: "", type: "", room: "" });
  const [requests, setRequests] = useState(mockRequests);

  function reassign(id) {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, staff: "Alex Kim" } : r))
    );
  }

  function escalate(id) {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, urgency: "High" } : r))
    );
  }

  const filteredRequests = requests.filter(
    (r) =>
      (!filter.staff || r.staff === filter.staff) &&
      (!filter.type || r.type === filter.type) &&
      (!filter.room || r.room === filter.room)
  );

  return (
    <div className="admin-dashboard-bg">
      <nav className="admin-nav">
        <div className="nav-logo">👔 <span>Admin Suite</span></div>
        <div>
          <span className="admin-name">{user?.name}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>
      <div className="admin-content">
        <section className="metrics-bar">
          <div className="metric-card">
            <div className="metric-title">Daily Volume</div>
            <div className="metric-value">{mockAnalytics.dailyVolume}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Weekly Volume</div>
            <div className="metric-value">{mockAnalytics.weeklyVolume}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Avg. Resolution</div>
            <div className="metric-value">{mockAnalytics.avgResolution}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Satisfaction</div>
            <div className="metric-value">{mockAnalytics.satisfaction}</div>
          </div>
        </section>
        <section className="charts-bar">
          <div className="bar-chart">
            <div className="chart-title">Service Requests (Weekly)</div>
            <div className="bar-chart-graph">
              {mockAnalytics.barData.map((d) => (
                <div key={d.day} className="bar">
                  <div
                    className="bar-inner"
                    style={{ height: `${d.volume * 2}px` }}
                  ></div>
                  <span>{d.day}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="top-performers">
            <div className="chart-title">Top Staff</div>
            <ul>
              {mockAnalytics.topStaff.map((s) => (
                <li key={s.name}>{s.name} ({s.completed} completed)</li>
              ))}
            </ul>
          </div>
        </section>
        <section className="control-panel">
          <div className="filters-bar">
            <select
              value={filter.staff}
              onChange={(e) => setFilter({ ...filter, staff: e.target.value })}
            >
              <option value="">All Staff</option>
              <option value="Jane Smith">Jane Smith</option>
              <option value="Alex Kim">Alex Kim</option>
            </select>
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="Room Cleaning">Room Cleaning</option>
              <option value="Laundry">Laundry</option>
            </select>
            <input
              type="text"
              placeholder="Room #"
              value={filter.room}
              onChange={(e) => setFilter({ ...filter, room: e.target.value })}
              style={{ width: "90px" }}
            />
          </div>
          <div className="requests-list">
            {filteredRequests.map((r) => (
              <div key={r.id} className={`admin-request-card urgency-${r.urgency.toLowerCase()}`}>
                <div className="card-main">
                  <div className="request-type">{r.type}</div>
                  <div className={`urgency-label urgency-${r.urgency.toLowerCase()}`}>{r.urgency}</div>
                </div>
                <div className="request-room">Room: {r.room}</div>
                <div className="assigned-label">Assigned: {r.staff}</div>
                <div className="request-status">Status: <span>{r.status}</span></div>
                <div className="actions-bar">
                  <button className="reassign-btn" onClick={() => reassign(r.id)}>Reassign</button>
                  <button className="escalate-btn" onClick={() => escalate(r.id)}>Escalate</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}