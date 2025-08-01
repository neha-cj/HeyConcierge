import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { supabase } from "../../services/supabaseClient";
import "./StaffDashboard.css";

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState({ category: "", status: "", room: "" });
  const [loading, setLoading] = useState(true);

  // Fetch requests from Supabase (with user info for room_no and full_name)
  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      const { data, error } = await supabase
      .from("service_requests")
      .select("*");
      console.log(data, error);
      if (error) {
        setRequests([]);
        console.error("Error fetching requests:", error);
      } else {
        setRequests(data || []);
      }
      setLoading(false);
    }
    fetchRequests();
  }, []);

  // Take request
  async function takeRequest(id) {
    const { error } = await supabase
      .from("service_requests")
      .update({
        status: "In Progress",
        assigned_to: user?.full_name,
      })
      .eq("id", id);
    if (!error) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: "In Progress", assigned_to: user?.full_name }
            : r
        )
      );
    }
  }

  // Update status
  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("service_requests")
      .update({
        status,
      })
      .eq("id", id);
    if (!error) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status }
            : r
        )
      );
    }
  }

  // Filtering (room filter uses users.room_no)
  const filteredRequests = requests.filter(
    (r) =>
      (!filter.category || r.category === filter.category) &&
      (!filter.status || r.status === filter.status) &&
      (!filter.room || r.users?.room_no === filter.room)
  );

  return (
    <div className="user-dashboard-bg">
      <nav className="user-nav">
        <div className="nav-logo">Staff Desk</div>
        <div>
          <span className="profile-btn">{user?.full_name}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="user-dashboard-container">
        {/* Filter Panel */}
        <div className="new-request-card">
          <h3>Filter Requests</h3>
          <div className="filters-bar">
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
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
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="requests-list">
              {filteredRequests.map((r) => (
                <div
                  key={r.id}
                  className={`request-card status-${r.status?.toLowerCase().replace(" ", "-")}`}
                >
                  <div className="request-type">{r.category}</div>
                  <div className="request-status">{r.status}</div>
                  <div className="request-note">{r.note}</div>
                  <div className="request-room">
                    Room: {r.users?.room_no || "N/A"}
                  </div>
                  <div className="request-user">
                    Guest: {r.users?.full_name || "N/A"}
                  </div>
                  {r.assigned_to && (
                    <div className="assigned-label">Assigned to: {r.assigned_to}</div>
                  )}

                  {r.status === "Pending" && (
                    <span className="mock-notif">Awaiting assignment…</span>
                  )}
                  {r.status === "In Progress" && (
                    <span className="mock-notif">In progress</span>
                  )}
                  {r.status === "Completed" && (
                    <span className="mock-notif">Completed</span>
                  )}

                  <div className="actions-bar">
                    {!r.assigned_to && r.status === "Pending" && (
                      <button className="take-btn" onClick={() => takeRequest(r.id)}>
                        Take Request
                      </button>
                    )}
                    {r.assigned_to === user?.full_name &&
                      r.status === "In Progress" && (
                        <button
                          className="update-btn"
                          onClick={() => updateStatus(r.id, "Completed")}
                        >
                          Mark Completed
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}