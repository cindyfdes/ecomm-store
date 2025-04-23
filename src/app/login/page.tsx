"use client";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { auth } from "../../client/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { RegisterUserConstants } from "../models/constants/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../stores/auth-context";

type FormItems = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [formItems, setFormItems] = useState<FormItems>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      setLoginErrorMsg("Something went wrong.");
    }
  }, [user]);

  const onClickSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    signInWithEmailAndPassword(auth, formItems.email, formItems.password).catch(
      (err) => {
        if (
          err.code === RegisterUserConstants.LOGIN_ERROR_INVALID_CREDENTIALS
        ) {
          setLoginErrorMsg("Username or password is invalid");
        } else {
          setLoginErrorMsg("Registration failed: " + err.message);
        }
        setLoading(false);
      }
    );
  };

  const onChangeFormItems = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormItems({ ...formItems, [name]: value });
  };

  return (
    <div className="flex justify-center h-screen ">
      <div className="w-1/2 h-1/2 border-solid border-slate-300 border-2 p-5 rounded-md m-5 flex justify-center flex-col">
        <div className="flex-1">
          <form
            onSubmit={(e) => onClickSignIn(e)}
            className="flex-1 flex flex-col justify-around"
          >
            <div className="mt-2">
              <div
                className={`text-red-500 text-sm h-5 transition-opacity duration-200 ${
                  loginErrorMsg ? "opacity-100" : "opacity-0"
                }`}
              >
                {loginErrorMsg || ""}
              </div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white "
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            {!loading ? (
              <button
                type="submit"
                className="rounded-full mt-3 text-center bg-gray-300 p-2 cursor-pointer w-1/2 mx-auto"
              >
                Log In
              </button>
            ) : (
              <div
                className="text-center mx-auto mt-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            )}
          </form>
        </div>
        <Link href="/login/register-user" className="hover:text-yellow-500">
          New here?? Create an account.
        </Link>
      </div>
    </div>
  );
};

export default Login;
