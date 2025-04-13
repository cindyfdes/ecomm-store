"use client";
import { UserContext } from "@/app/reducers/user-reducer";
import { RegisterUserConstants } from "../../models/constants/firebase";
import { auth } from "@/client/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  ChangeEventHandler,
  useContext,
  useState,
} from "react";
import { userRoles } from "@/app/models/constants/common";
import { loggedInUserConstants } from "@/app/models/constants/reducerConstants";

type FormItems = {
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
};

const RegisterUser = () => {
  const router = useRouter();
  const { loggedInUserDispatch } = useContext(UserContext);
  const [formItems, setFormItems] = useState<FormItems>({
    email: "",
    password: "",
    userName: "",
    confirmPassword: "",
  });

  const onClickRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    e.preventDefault();
    try {
      const firebaseResp = await createUserWithEmailAndPassword(
        auth,
        formItems.email,
        formItems.password
      );

      const backendApiResp = await fetch(
        `${BACKEND_URL}/api/user/save-new-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: firebaseResp.user.email,
            userName: formItems.userName,
          }),
        }
      );
      if (!backendApiResp.ok) {
        await firebaseResp.user.delete();
        const errMsg = await backendApiResp.text();
        throw new Error(
          `Server responded with ${backendApiResp.status}: ${errMsg}`
        );
      }

      const loggedInUser = {
        token: await firebaseResp.user.getIdToken(),
        role: userRoles.USER,
        userName: formItems.userName,
      };

      loggedInUserDispatch({
        payload: loggedInUser,
        type: loggedInUserConstants.ADD_USER,
      });
      router.push("/");
    } catch (err: any) {
      if (err.code === RegisterUserConstants.ERROR_EMAIL_ALREADY_REGISTERED) {
        alert(
          "This email is already registered. Please use a different email."
        );
      } else {
        alert("Registration failed: " + err.message);
      }
    }
  };

  const onChangeFormItems = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormItems({ ...formItems, [name]: value });
  };
  return (
    <div className="flex justify-center h-screen ">
      <div className="w-1/2 h-1/2 border-solid border-slate-300 border-2 p-5 rounded-md m-5 flex justify-center flex-col">
        <h2 className="h-1/10 mb-1 mt-2 font-bold font-sans text-lg text-center">
          CREATE ACCOUNT
        </h2>
        <form
          onSubmit={(e) => onClickRegister(e)}
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
              htmlFor="userName"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              User Name
            </label>
            <input
              type="text"
              id="userName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={formItems.userName}
              onChange={onChangeFormItems}
              required
              placeholder="Enter user name"
              name="userName"
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
          <div className="mt-2">
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              placeholder="Enter password"
              value={formItems.confirmPassword}
              onChange={onChangeFormItems}
              name="confirmPassword"
            />
          </div>

          <button
            type="submit"
            className="rounded-full mt-3 text-center bg-gray-300 p-2 cursor-pointer w-1/2 mx-auto"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
