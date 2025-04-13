"use client";
import { UserContext } from "@/app/reducers/user-reducer";
import Link from "next/link";
import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../client/firebase";
import { loggedInUserConstants } from "@/app/models/constants/reducerConstants";

const LoginStatusDisplay = () => {
  const { loggedInUser, loggedInUserDispatch } = useContext(UserContext);
  console.log("user from login-status-display", loggedInUser);
  const LogoutButton = () => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        loggedInUserDispatch({
          payload: null,
          type: loggedInUserConstants.CLEAR_USER,
        });
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
      {loggedInUser == null ? (
        <Link href="/login" className="hover:text-yellow-500">
          Log In
        </Link>
      ) : (
        <>
          <p>Welcome {loggedInUser.userName}</p>
          <button onClick={LogoutButton}>Log out</button>
        </>
      )}
    </div>
  );
};

export default LoginStatusDisplay;
