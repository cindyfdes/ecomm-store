"use client";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { auth } from "../../client/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import Link from "next/link";
import { RegisterUserConstants } from "../models/constants/firebase";
import { UserContext } from "../reducers/user-reducer";
import { userRoles } from "../models/constants/common";
import { loggedInUserConstants } from "../models/constants/reducerConstants";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

type FormItems = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [info, setInfo] = useState<string>("");
  const [fetchedData, setFetchedData] = useState<string>("");
  const [formItems, setFormItems] = useState<FormItems>({
    email: "",
    password: "",
  });
  const { loggedInUser, loggedInUserDispatch } = useContext(UserContext);

  const onClickSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, formItems.email, formItems.password).catch(
      (err) => {
        if (
          err.code === RegisterUserConstants.LOGIN_ERROR_INVALID_CREDENTIALS
        ) {
          alert("Username or password is invalid");
        } else {
          alert("Registration failed: " + err.message);
        }
      }
    );
  };

  const onChangeFormItems = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormItems({ ...formItems, [name]: value });
  };

  const logout = async () => {
    await signOut(auth);
    setFirebaseUser(null);
  };

  const saveData = async () => {
    if (!firebaseUser) return;

    const token = await firebaseUser.getIdToken();
    const res = await fetch(`${BACKEND_URL}/data`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ info }),
    });

    const result = await res.text();
    alert(result);
  };

  const loadData = async () => {
    if (!firebaseUser) return;

    const token = await firebaseUser.getIdToken();
    const res = await fetch(`${BACKEND_URL}/data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert("Failed to fetch data");
      return;
    }

    const data = await res.json();
    setFetchedData(JSON.stringify(data, null, 2));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const createUserObject = async () => {
    if (firebaseUser != null) {
      return {
        token: await firebaseUser.getIdToken(),
        role: userRoles.USER,
        userName: "test",
      };
    }
    return null;
  };

  useEffect(() => {
    createUserObject().then((res) => {
      if (res != null) {
        loggedInUserDispatch({
          payload: res,
          type: loggedInUserConstants.ADD_USER,
        });
      }
    });
  }, [firebaseUser]);

  return (
    <div className="flex justify-center h-screen ">
      <div className="w-1/2 h-1/2 border-solid border-slate-300 border-2 p-5 rounded-md m-5 flex justify-center flex-col">
        <div className="flex-1">
          <form
            onSubmit={(e) => onClickSignIn(e)}
            className="flex-1 flex flex-col justify-around"
          >
            <div className="mt-2">
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={formItems.email}
                onChange={onChangeFormItems}
                required
                placeholder="Enter email"
                name="email"
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                placeholder="Enter password"
                value={formItems.password}
                onChange={onChangeFormItems}
                name="password"
              />
            </div>

            <button
              type="submit"
              className="rounded-full mt-3 text-center bg-gray-300 p-2 cursor-pointer w-1/2 mx-auto"
            >
              Log In
            </button>
          </form>
        </div>
        <Link href="/login/register-user" className="hover:text-yellow-500">
          New here?? Create an account.
        </Link>

        {/* {/* {!user ? (
        <RegisterUser />
      ) : (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={logout}>Logout</button>

          <hr />
          <input
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            placeholder="Enter info to save"
          />
          <button onClick={saveData}>Save to Firestore</button>

          <hr />
          <button onClick={loadData}>Load from Firestore</button>
          <pre>{fetchedData}</pre> 
        </>
      )} */}
      </div>
    </div>
  );
};

export default Login;
