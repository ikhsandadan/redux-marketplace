import Login from "./pages/auth/Login";
import Admin from "./pages/path/Admin";
import Seller from "./pages/path/Seller";
import Shopper from "./pages/path/Shopper";
import { useAppSelector } from "./store";
import { RouterProvider, Navigate } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import NotFound from "./pages/404";
import Register from "./pages/auth/Register";
import type { AuthState, UserResponse } from "./services/auth/types";
import "./App.css";

const App = () => {
	let authState: AuthState = {
    	user: null,
    	token: null
	};
	const { user, token } = useAppSelector((state) => state.auth);
	const userSession = sessionStorage.getItem("user");
	const response: UserResponse = userSession ? JSON.parse(userSession) : null;
	if (sessionStorage.getItem("isAuthenticated") === "true" && response !== null) {
		authState = {
			user: {
				username: response.username,
				id: response.userId,
				email: response.email,
				role: response.role
			} ?? user,
			token: response.token ?? token
		}
	};
	const isAuthenticated = authState.user !== null && authState.token !== null;

	const router = createBrowserRouter([
    	{
        	path: "/",
        	element: (
            	<Login authState={authState} isAuthenticated={isAuthenticated} />
        	),
        	children: [
            	{
                	path: "register",
                	element: (
                    	<Register isAuthenticated={isAuthenticated} />
                	),
            	},
        	],
    	},
		{
			path: "/path/admin",
			element: isAuthenticated && authState.user?.role === "admin" ? (
				<Admin isAuthenticated={isAuthenticated} authState={authState} />
			) : (
				<Navigate to="/" />
			),
		},
		{
			path: "/path/seller",
			element: isAuthenticated && authState.user?.role === "seller" ? (
				<Seller isAuthenticated={isAuthenticated} authState={authState} />
			) : (
				<Navigate to="/" />
			),
		},
		{
			path: "/path/shopper",
			element: isAuthenticated && authState.user?.role === "shopper" ? (
				<Shopper isAuthenticated={isAuthenticated} authState={authState} />
			) : (
				<Navigate to="/" />
			),
		},
    	{
        	path: "*",
        	element: <NotFound />,
    	},
	]);

	return (
    	<div>
        	<RouterProvider router={router} />
    	</div>
	);
};

export default App;