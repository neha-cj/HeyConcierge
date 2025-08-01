import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { supabase } from "../../services/supabaseClient";
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
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

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

  return (
    <div className="user-profile-bg">
      <div className="profile-card">
        <h2>{userData?.full_name || user?.user_metadata?.full_name}</h2>
        <div className="profile-row">Room: <span>{userData?.room_no || user?.user_metadata?.room_no}</span></div>
        <div className="profile-row">Email: <span>{userData?.email || user?.email}</span></div>
        <div className="profile-row">Phone: <span>+1 555 301 1234</span></div>
      </div>
    </div>
  );
}