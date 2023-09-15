import React, { useState, useEffect } from "react";
import * as Auth from "../services/AuthServices";
import { User } from "../types/UserType";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";
import Traduction from "../languages/Traduction";

const Register: React.FC = () => {
	// State to hold users fetched from the database
	const [usersFromDb, setUsersFromDb] = useState<User[]>([]);
	const id = uuidv4();

	// Fetch all users from the database when the component mounts
	useEffect(() => {
		const fetchUsers = async () => {
			const fetchedUsers = await Auth.getUsers();
			setUsersFromDb(fetchedUsers);
		};

		fetchUsers();
	}, []);

	// Initialize new user state
	const [newUser, setNewUser] = useState<User>({
		id: id,
		username: "",
		email: "",
		password: "",
	});

	// Initialize error and loading states
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	// Handle form input changes
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setError(null);
		const { name, value } = e.target;
		setNewUser(prevUser => ({
			...prevUser,
			[name]: value,
		}));
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		// Validate input fields
		if (!newUser.username || !newUser.email || !newUser.password) {
			setError(Traduction.ErrorMessagesTraduction.allFieldsAreRequired);
			return;
		}

		// Check if email already exists
		const emailExists = Array.isArray(usersFromDb) && usersFromDb.some(user => user.email === newUser.email);
		if (emailExists) {
			setError(Traduction.ErrorMessagesTraduction.emailAlreadyExists);
			return;
		}

		// Validate email format
		if (!/\S+@\S+\.\S+/.test(newUser.email)) {
			setError(Traduction.ErrorMessagesTraduction.emailNotValid);
			return;
		}

		// Validate password length
		if (newUser.password.length < 6) {
			setError(Traduction.ErrorMessagesTraduction.passwordLengthIncorrect);
			return;
		}

		try {
			// Hash the password before sending it to the server
			const hashedPassword = bcrypt.hashSync(newUser.password, 10);
			const userToSend = { ...newUser, password: hashedPassword };

			// Attempt to create the new user
			setLoading(true);
			const response = await Auth.CreateUser(userToSend);
			if (response) {
				setLoading(false);
				// Update local storage and redirect user
				localStorage.setItem("isAuthenticated", "true");
				localStorage.setItem("user", newUser.username);
				window.location.href = "/app";
			} else {
				setLoading(false);
				setError(Traduction.ErrorMessagesTraduction.somethingWentWrong);
			}
		} catch (error) {
			setLoading(false);
			setError(Traduction.ErrorMessagesTraduction.somethingWentWrong);
		}
	};

	return (
		<div className="relative h-screen flex  flex-col items-center justify-center text-center text-white py-0 px-3">
			<video
				src="src/assets/NBA_video.mp4"
				autoPlay
				loop
				muted
				className="blur-sm z-10 w-full h-full"
			/>

			<div
				className={
					" p-8 flex justify-center bg-darkgray z-20 absolute rounded-xl"
				}
			>
				<form onSubmit={handleSubmit}>
					<h1 className="text-3xl font-bold mb-6">
						{Traduction.RegisterTraduction.register}
					</h1>
					<div className="mb-6">
						<label
							htmlFor="username"
							className="block mb-2 text-sm font-medium text-white"
						>
							{Traduction.RegisterTraduction.userName}
						</label>
						<input
							type="text"
							name="username"
							id="username"
							className={`shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-lightgray border-gray-600 placeholder-gray-400 text-white focus:ring-purple focus:border-purple focus:outline-purple shadow-sm-light ${error == Traduction.ErrorMessagesTraduction.userNameIsRequired ||
								error == Traduction.ErrorMessagesTraduction.allFieldsAreRequired
								? "border-red-500" : ""
								}`}
							onChange={handleChange}
							value={newUser.username}
							placeholder="Username"
						/>
					</div>
					<div className={"mb-6"}>
						<label
							htmlFor="email"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							{Traduction.RegisterTraduction.email}
						</label>
						<input
							className={`shadow-sm border  text-sm rounded-lg block w-full p-2.5 bg-lightgray border-gray-600 placeholder-gray-400 text-white focus:ring-purple focus:border-purple focus:outline-purple shadow-sm-light ${error == Traduction.ErrorMessagesTraduction.emailAlreadyExists ||
								error == Traduction.ErrorMessagesTraduction.emailNotValid ||
								error == Traduction.ErrorMessagesTraduction.emailIsRequired ||
								error == Traduction.ErrorMessagesTraduction.allFieldsAreRequired
								? "border-red-500" : ""
								}`}
							type="email"
							name="email"
							id="email"
							onChange={handleChange}
							placeholder="Email"
							value={newUser.email}
						/>
					</div>
					<div className="mb-6">
						<label
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							htmlFor="password"
						>
							{Traduction.RegisterTraduction.password}
						</label>
						<input
							type="password"
							name="password"
							id="password"
							className={`shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-lightgray border-gray-600 placeholder-gray-400 text-white focus:ring-purple focus:border-purple focus:outline-purple shadow-sm-light ${error == Traduction.ErrorMessagesTraduction.passwordIsRequired ||
								error == Traduction.ErrorMessagesTraduction.passwordLengthIncorrect ||
								error == Traduction.ErrorMessagesTraduction.allFieldsAreRequired
								? "border-red-500" : ""
								}`}
							onChange={handleChange}
							placeholder="Password"
							value={newUser.password}
						/>
					</div>
					<div className="flex items-start mb-6">
						<div className="flex items-center h-5">
							<input
								id="terms"
								type="checkbox"
								value=""
								className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
							/>
						</div>
						<label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 ">
							I agree with the{" "}
							<a
								href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
								className="text-blue-600 hover:underline dark:text-purple"
							>
								terms and conditions
							</a>
						</label>
					</div>
					<button
						type="submit"
						className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple dark:focus:ring-blue-800"
					>
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
							Traduction.RegisterTraduction.button
						)}
					</button>

					{error && (
						<div className="text-red-500 text-sm mt-4">{error}</div>
					)}
				</form>
			</div>
		</div>
	);
}
export default Register;
