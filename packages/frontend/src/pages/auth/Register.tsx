import { useState } from "react";
import { useNavigate } from "react-router";
import { useRegisterMutation } from "../../services/auth/authSlice";
import type { RegisterRequest } from "../../services/auth/types";

const Register = ({
	isAuthenticated,
}: { isAuthenticated: boolean }) => {
	const navigate = useNavigate();
	const [register, { isLoading }] = useRegisterMutation();
	const [registerFormData, setRegisterFormData] = useState<RegisterRequest>({
    	username: "",
    	email: "",
    	password: "",
		role: "admin",
	});

	return (
    	<div className="card">
        	{!isAuthenticated && (
            	<>
                	<h2 className="text-xl font-semibold mb-2">Register to our blogging platform</h2>
                	<form
                    	className="login"
                    	onSubmit={(e) => {
                        	e.preventDefault();
                        	try {
                            	register(registerFormData)
                                	.then((data) => {
                                    	if (data?.data?.ok) {
                                        	return navigate("/", {
                                            	replace: true,
                                        	});
                                    	}
                                    	alert("Invalid credentials!");
                                	})
                                	.catch(() =>
                                    	alert("Server error! Please file a bug report!"),
                                	);
                        	} catch (err) {
                            	alert(`Failed to register; got ${err}`);
                        	}
                    	}}
                	>
                    	<input
                        	id="username"
                        	placeholder="Username"
                        	type="text"
                        	value={registerFormData.username}
                        	onChange={(e) =>
                            	setRegisterFormData({
                                	...registerFormData,
                                	username: e.target.value,
                            	})
                        	}
                    	/>
                    	<input
                        	id="email"
                        	placeholder="Email"
                        	type="email"
                        	value={registerFormData.email}
                        	onChange={(e) =>
                            	setRegisterFormData({
                                	...registerFormData,
                                	email: e.target.value,
                            	})
                        	}
                    	/>
                    	<input
                        	id="password"
                        	type="password"
                        	placeholder="Password"
                        	value={registerFormData.password}
                        	onChange={(e) =>
                            	setRegisterFormData({
                                	...registerFormData,
                                	password: e.target.value,
                            	})
                        	}
                    	/>
						<select 
							id="role" 
							name="role"
							value={registerFormData.role}
							onChange={(e) =>
                            	setRegisterFormData({
                                	...registerFormData,
                                	role: e.target.value,
                            	})
                        	}
							className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
							>
							<option value="admin">Admin</option>
							<option value="seller">Seller</option>
							<option value="shopper">Shopper</option>
						</select>
                    	<button type="submit">
                        	{isLoading ? "Registering..." : "Register"}
                    	</button>
                	</form>
            	</>
        	)}
    	</div>
	);
};

export default Register;