import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useLoginMutation } from "../../services/auth/authSlice";
import { useGetAllItemsQuery } from "../../services/items/itemSlice";
import type { AuthState, LoginRequest } from "../../services/auth/types";
import { Link } from "react-router-dom";
import LogOutButton from "../auth/LogOutButton";
import BuyItemModal from "../components/BuyItemModal";
import type { ItemModel } from "../../services/items/types";

import defaultItemImage from "../../../src/images/default-product.png";

const Login = ({
	isAuthenticated,
	authState,
}: { isAuthenticated: boolean; authState: AuthState }) => {
	const navigate = useNavigate();
	const [login, { isLoading }] = useLoginMutation();
	const { data: allItems } = useGetAllItemsQuery();
	const [loginFormData, setLoginFormData] = useState<LoginRequest>({
    	email: "",
    	password: "",
	});
	const [openBuyItemModal, setOpenBuyItemModal] = useState(false);
	const handleCloseItemModal = () => setOpenBuyItemModal(false);
	const [itemToBuy, setItemToBuy] = useState<ItemModel>({
		id: 0,
		sellerId: 0,
		sellerUserName: "",
		title: "",
		price: 0,
		quantity: 0,
		description: "",
		image: "",
		status: "",
		buyers: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const handleBuyItemButton = (item: ItemModel) => {
		setOpenBuyItemModal(true);
		setItemToBuy(item);
	};

	return (
    	<div className="card">
        	{isAuthenticated ? (
				<>
            	<div className="card flex justify-between">
					{authState.user?.role === "admin" ? (
						<h3 className="text-2xl font-semibold">
							You are logged in {authState?.user?.username} and your role is {authState?.user?.role}. Go{" "}
							<Link to={"/path/admin"} className="text-blue-600">here</Link> to manage users.
						</h3>
					) : authState.user?.role === "seller" ? (
						<h3 className="text-2xl font-semibold">
							You are logged in {authState?.user?.username} and your role is {authState?.user?.role}. Go{" "}
							<Link to={"/path/seller"} className="text-blue-600">here</Link> to manage your store.
						</h3>
					) : authState.user?.role === "shopper" ? (
						<h3 className="text-2xl font-semibold">
							You are logged in {authState?.user?.username} and your role is {authState?.user?.role}. Go{" "}
							<Link to={"/path/shopper"} className="text-blue-600">here</Link> to view your buying items.
						</h3>
					) :(null)}
					<LogOutButton />
				</div>
				<div className="flex flex-row flex-wrap items-center gap-4">
					{allItems?.map((item: any, index: number) => (
						<div key={index} className='flex flex-col flex-wrap items-center gap-2 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl'>
							<div className="md:flex">
								<div className="p-2">
									<img className="h-48 w-full object-cover" src={item.image ?? defaultItemImage} alt={item.title} />
								</div>
								<div className="p-8">
									<div className={`uppercase tracking-wide text-sm font-semibold ${item.status === "sold" || item.status === "disable" ? "text-red-500" : "text-indigo-500"}`}>{item.status}</div>
									<p className="block mt-1 text-lg leading-tight font-semibold text-black">{item.title}</p>
									<p className="mt-2 text-gray-500">{item.description}</p>
									<div className="mt-4">
										<span className="text-gray-900">Price: </span>
										<span className="text-gray-900 font-bold">${item.price}</span>
									</div>
									<div className="mt-2">
										<span className="text-gray-900">Quantity: </span>
										<span className="text-gray-900 font-bold">{item.quantity}</span>
									</div>
									<div className="mt-4">
										<span className="text-gray-900">Seller: </span>
										<span className="text-gray-900 font-bold">{item.sellerUserName}</span>
									</div>
									<div className="mt-2">
										<span className="text-gray-600">Created At: </span>
										<span className="text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</span>
									</div>
									<div className="mt-2">
										<span className="text-gray-600">Updated At: </span>
										<span className="text-gray-600">{new Date(item.updatedAt).toLocaleDateString()}</span>
									</div>
								</div>
							</div>
							{authState.user?.username !== item.sellerUserName && authState.user?.role === "shopper" && item.status === "available" ? (
								<button className='bg-blue-500 text-white py-2 px-4 rounded-lg mb-4' onClick={() => handleBuyItemButton(item)}>Buy</button>
							) : (null)}
						</div>
					))}
				</div>
				</>
        	) : (
            	<>
                	<h2 className="text-2xl font-semibold mb-2">Login to our blogging platform</h2>
                	<form
                    	className="login"
                    	onSubmit={(e) => {
                        	e.preventDefault();
                        	try {
                            	login(loginFormData)
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
                            	alert(`Failed to login; got ${err}`);
                        	}
                    	}}
                	>
                    	<input
                        	id="email"
                        	placeholder="Email"
                        	type="email"
                        	value={loginFormData.email}
                        	onChange={(e) =>
                            	setLoginFormData({ ...loginFormData, email: e.target.value })
                        	}
                    	/>
                    	<input
                        	id="password"
                        	type="password"
                        	placeholder="Password"
                        	value={loginFormData.password}
                        	onChange={(e) =>
                            	setLoginFormData({ ...loginFormData, password: e.target.value })
                        	}
                    	/>
                    	<div className="buttons">
                        	<button type="submit">
                            	{isLoading ? "Logging in..." : "Login"}
                        	</button>
                        	<button type="button" onClick={() => navigate("/register")}>
                            	Click here to register
                        	</button>
                    	</div>
                	</form>
            	</>
        	)}
        	<Outlet />
			<BuyItemModal  open={openBuyItemModal} onClose={handleCloseItemModal} item={itemToBuy} userId={authState.user?.id ?? 0}/>
    	</div>
	);
};

export default Login;