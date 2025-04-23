"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../client/firebase";
import { loggedInUserConstants } from "@/app/models/constants/reducerConstants";
import { useAuth } from "@/app/stores/auth-context";
import PersonIcon from "@mui/icons-material/Person";

const LoginStatusDisplay = () => {
  const { user } = useAuth();

  const LogoutButton = () => {
    const handleLogout = async () => {
      try {
        await signOut(auth);

        console.log("Logged out successfully!");
        // You can redirect or update the UI as needed here
      } catch (error) {
        console.error("Error logging out: ", error);
      }
    };
    handleLogout();
  };

  return (
    <div>
      {!user ? (
        <Link href="/login" className="hover:text-yellow-500">
          Log In
        </Link>
      ) : (
        <div className="flex ">
          <div>
            <PersonIcon /> {user.displayName ?? user.email}
          </div>
          <button onClick={LogoutButton} className="hover:cursor-pointer pl-3">
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginStatusDisplay;
