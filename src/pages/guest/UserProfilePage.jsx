import { useAuth } from "../../contexts/AuthContext";
import "./UserProfilePage.css";

const mockRequests = [
  {
    id: 1,
    type: "Room Cleaning",
    status: "Pending",
    note: "Please clean before noon.",
    createdAt: "2025-07-30 09:30",
  },
  {
    id: 2,
    type: "Laundry",
    status: "Completed",
    note: "",
    createdAt: "2025-07-29 18:20",
  },
];

export default function UserProfilePage() {
  const { user } = useAuth();

  return (
    <div className="user-profile-bg">
      <div className="profile-card">
        <h2>{user?.name}</h2>
        <div className="profile-row">Room: <span>{user?.room}</span></div>
        <div className="profile-row">Email: <span>{user?.email}</span></div>
        <div className="profile-row">Phone: <span>+1 555 301 1234</span></div>
      </div>
    </div>
  );
}