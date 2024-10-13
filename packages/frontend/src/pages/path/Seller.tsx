import { useState } from 'react';
import { Link } from "react-router-dom";
import LogOutButton from "../auth/LogOutButton";
import type { AuthState } from "../../services/auth/types";
import { ItemsCreateRequest, ItemUpdateRequest } from "../../services/items/types";
import { useCreateItemMutation, useGetItemsByUsernameQuery, useDeleteItemMutation } from '../../services/items/itemSlice';
import type { ErrorResponse } from "../../services/error-types";
import EditItemModal from '../components/EditItemModal';

import defaultItemImage from "../../../src/images/default-product.png";

const Seller = ({ isAuthenticated, authState }: { isAuthenticated: boolean; authState: AuthState }) => {
    const [createItem] = useCreateItemMutation();
    const [deleteItem] = useDeleteItemMutation();
	const { data: items } = useGetItemsByUsernameQuery(
    	authState.user?.username as string,
	);
    const [itemImage, setItemImage] = useState<string>("");
    const [itemData, setItemData] = useState<ItemsCreateRequest>({
        title: "",
        price: 0,
        quantity: 0,
        description: "",
        image: "",
    });
    const [editItemData, setEditItemData] = useState<ItemUpdateRequest>({
        id: 0,
        title: "",
        price: 0,
        quantity: 0,
        description: "",
        image: "",
        status: "",
    });
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const handleEditModalClose = () => setOpenEditModal(false);

    const convertToBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error: any) => {
                reject(error);
            };
        });
    };

    const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const base64 = await convertToBase64(file!);
        setItemImage(base64 as string);
        setItemData({ ...itemData, image: base64 as string });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    	try {
        	createItem(itemData)
            	.then((payload) => {
                	if (
                    	payload.data?.ok !== undefined &&
                    	payload.data?.message !== undefined
                	) {
                    	if (payload.data?.ok) {
                        	alert(payload.data?.message);
                            // Reset form data
                            setItemData({
                                title: "",
                                price: 0,
                                quantity: 0,
                                description: "",
                                image: "",
                            });
                            setItemImage("");
                        	return;
                    	}
                	}
                	const error = payload.error as ErrorResponse | undefined;
                	alert(error?.message);
            	})
            	.catch((error) => {
                	console.log("rejected", error);
                	alert("Something went wrong");
            	});
    	} catch (err) {
        	alert(`Failed to create blog post with error: ${err}`);
    	}
    };

    const handleDeleteButton = (id: number, title: string) => {
        deleteItem({ id: id, title: title })
			.then((payload) => {
				if (
					payload.data?.ok !== undefined &&
					payload.data?.message !== undefined
				) {
					if (payload.data?.ok) {
						alert(payload.data?.message);
						return;
					}
				}
				const error = payload.error as ErrorResponse | undefined;
				alert(error?.message);
			})
			.catch((error) =>
				console.error(`Failed to delete with error: ${error}`),
			)
    };

    const handleEditItemButton = (itemId: number, title: string, price: number, quantity: number, description: string, image: string, status: string) => {
		setEditItemData({
			id: itemId,
            title: title,
            price: price,
            quantity: quantity,
            description: description,
            image: image,
            status: status,
		});
		setOpenEditModal(true);
	};

    return (
        <div className="card">
            {isAuthenticated ? (
            <>
            <div className="flex justify-between">
                <div className="flex flex-col text-2xl font-semibold">
                    <h2>Welcome {authState.user?.role} {authState.user?.username}{" "}</h2>
                    <div className="max-h-2">
                        <Link to={"/"} className="text-blue-600">Back to home</Link>
                    </div>
                </div>
                <LogOutButton />
            </div>
            <div className='card'>
                <form onSubmit={handleSubmit} className="mt-2">
                    <h3 className="text-xl font-semibold text-center mb-4">List an item for sale</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium">Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Item Title"
                                className="bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1"
                                value={itemData.title}
                                onChange={(e) => setItemData({ ...itemData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium">Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                name="image"
                                id="image"
                                className="bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1"
                                onChange={handleProfilePictureChange}
                            />
                            {itemImage && (
                                <div className="mt-4 flex justify-center">
                                    <img src={itemImage} alt="Item" className="w-auto h-60 object-cover rounded-md" />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium">Price</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">$</span>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    placeholder="Price"
                                    className="bg-white border text-gray-900 sm:text-sm rounded-r-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1"
                                    value={itemData.price}
                                    onChange={(e) => setItemData({ ...itemData, price: parseInt(e.target.value) })}
                                    required
                                    min={1}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                placeholder="Quantity"
                                className="bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1"
                                value={itemData.quantity}
                                onChange={(e) => setItemData({ ...itemData, quantity: parseInt(e.target.value) })}
                                required
                                min={1}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                placeholder="Item Description"
                                className="bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1"
                                value={itemData.description ?? ""}
                                onChange={(e) => setItemData({ ...itemData, description: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-center gap-2 mt-4">
                            <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-lg">Sell Item</button>
                            <button type="button" onClick={() => {
                                setItemData({ title: "", price: 0, quantity: 0, description: "", image: "" });
                                setItemImage("");
                            }} className="bg-red-500 text-white py-2 px-4 rounded-lg">Reset</button>
                        </div>
                    </div>
                </form>
                <div className='card'>
                    <div className='text-center text-2xl mt-4 pb-4 font-semibold'>
                        <h3>Your items for sale</h3>
                    </div>
                    <div className="flex flex-row flex-wrap items gap-4">
                        {items?.map((item: any, index: number) => (
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
                                <div className='flex flex-row gap-4 mb-4'>
                                    <button className='bg-blue-500 text-white py-2 px-4 rounded-lg' onClick={() => handleEditItemButton(item.id, item.title, item.price, item.quantity, item.description, item.image, item.status)}>Edit Item</button>
                                    <button className='bg-red-500 text-white py-2 px-4 rounded-lg' onClick={() => handleDeleteButton(item.id, item.title)}>Delete Item</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </>
            ) : (
                <Link to={"/"}>You're not authorized as seller. Back to home</Link>
            )}
            <EditItemModal open={openEditModal} onClose={handleEditModalClose} formData={editItemData} setFormData={setEditItemData} convertToBase64={convertToBase64} />
        </div>
    );
};

export default Seller;
