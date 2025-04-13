"use client";
import React, { createContext, ReactNode, useReducer, useState } from "react";
import { userRoles } from "../models/constants/common";
import { PortalUser as User } from "../models/User";
import { loggedInUserConstants } from "../models/constants/reducerConstants";

const initialUser: User | null = null;

export const UserContext = createContext<{
  loggedInUser: User | null;
  loggedInUserDispatch: React.Dispatch<Action>;
}>({
  loggedInUser: null,
  loggedInUserDispatch: () => null,
});

type Action =
  | { type: typeof loggedInUserConstants.ADD_USER; payload: User }
  | { type: typeof loggedInUserConstants.CLEAR_USER; payload: null };

const reducer = (state: { loggedInuser: User | null }, action: Action) => {
  switch (action.type) {
    case loggedInUserConstants.ADD_USER:
      return { loggedInuser: action.payload };
    case loggedInUserConstants.CLEAR_USER:
      return { loggedInuser: null };
    default:
      return state;
  }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { loggedInuser: null });

  return (
    <UserContext.Provider
      value={{
        loggedInUser: state.loggedInuser,
        loggedInUserDispatch: dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
