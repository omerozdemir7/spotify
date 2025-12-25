import React from "react";
import { auth } from "../lib/firebase";
import { User } from "firebase/auth";

interface ProfileProps {
  user: User | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      {user && (
        <div className="space-y-4">
          <p>
            <span className="font-bold">Email:</span> {user.email}
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
