import React, { useState, useEffect } from "react";
import * as Auth from "../services/AuthServices";
import { User } from "../types/UserType";
import bcrypt from 'bcryptjs'
import Traduction from "../languages/Traduction";


const Login: React.FC = () => {
    // Initialize state variables
    const [login, setLogin] = useState<User>({ id: "", username: "", email: "", password: "" });
    const [userFromDb, setUserFromDb] = useState<User[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch users from DB when component mounts
    useEffect(() => {
        Auth.getUsers()
            .then(setUserFromDb)
            .catch(() => setError(Traduction.ErrorMessagesTraduction.failedToLoadUsers));
    }, []);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLogin(prevState => ({ ...prevState, [name]: value }));
        setError("");
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        // Validate form input
        if (!login.email || !login.password) {
            setError(Traduction.ErrorMessagesTraduction.allFieldsAreRequired);
            return;
        }

        // Check if user data loaded properly
        if (!userFromDb) {
            setError(Traduction.ErrorMessagesTraduction.failedToLoadUsers);
            return;
        }

        // Check if user exists
        if (Array.isArray(userFromDb)) {
            const userExists = userFromDb.find((user) => user.email === login.email);
            if (!userExists) {
                setError(Traduction.ErrorMessagesTraduction.emailIsIncorrect);
                return;
            }

            // Validate password
            const passwordMatches = bcrypt.compareSync(login.password, userExists.password);

            if (!passwordMatches) {
                setError(Traduction.ErrorMessagesTraduction.passwordIsIncorrect);
                return;
            }

            // Set loading state and proceed with login
            setLoading(true);

            // Simulating authentication time
            setTimeout(() => {
                setLoading(false);
                // For demonstration purposes, using localStorage. 
                // In a real app, use more secure methods to store authentication tokens.
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("user", userExists.username);
                window.location.href = "/app";
            }, 2000);
        }
    };

    return (
        <div className="relative h-screen flex  flex-col items-center justify-center text-center text-white py-0 px-3">
            <video src="./assets/NBA_video.mp4" autoPlay loop muted className="blur-sm z-10 w-full h-full" />

            <div className={" p-8 flex justify-center bg-darkgray z-20 absolute rounded-xl"}>
                <form onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold mb-4">
                        {Traduction.LoginTraduction.login}
                    </h1>
                    <div className={"mb-6"}>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            {Traduction.LoginTraduction.email}
                        </label>
                        <input
                            className={` shadow-sm border  text-sm rounded-lg block w-full p-2.5 bg-lightgray border-gray-600 placeholder-gray-400 text-white focus:ring-purple focus:border-purple focus:outline-purple shadow-sm-light ${error == Traduction.ErrorMessagesTraduction.emailIsRequired ||
                                error == Traduction.ErrorMessagesTraduction.emailIsIncorrect ||
                                error == Traduction.ErrorMessagesTraduction.allFieldsAreRequired
                                ? "border-red-500" : ""
                                }`}
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleChange}
                            placeholder={"Email"}
                            value={login.email}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="password">
                            {Traduction.LoginTraduction.password}
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder={"Password"}
                            className={` shadow-sm border  text-sm rounded-lg block w-full p-2.5 bg-lightgray border-gray-600 placeholder-gray-400 text-white focus:ring-purple focus:border-purple focus:outline-purple shadow-sm-light ${error == Traduction.ErrorMessagesTraduction.passwordIsRequired ||
                                error == Traduction.ErrorMessagesTraduction.passwordIsIncorrect ||
                                error == Traduction.ErrorMessagesTraduction.allFieldsAreRequired
                                ? "border-red-500" : ""
                                }`}
                            onChange={handleChange}
                            value={login.password}
                        />
                    </div>

                    <div className="mb-6">
                        <span className="flex gap-3">
                            {Traduction.LoginTraduction.dontHaveAnAccount}
                            <a href="/register" className="text-blue-700 hover:text-blue-800 font-medium">
                                {Traduction.LoginTraduction.register}
                            </a>
                        </span>
                    </div>

                    <button type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple dark:focus:ring-blue-800">
                        {/* set loading effect  */}
                        {loading ? (
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25 stroke-purple"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
                                ></path>
                            </svg>
                        ) : (
                            Traduction.LoginTraduction.login
                        )}
                    </button>

                    {error && (
                        <div className="text-red-500 text-sm mt-4">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
export default Login;
