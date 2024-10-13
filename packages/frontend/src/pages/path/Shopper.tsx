import { useState } from 'react';
import type { AuthState } from "../../services/auth/types";
import { Link } from "react-router-dom";
import LogOutButton from "../auth/LogOutButton";
import defaultItemImage from "../../../src/images/default-product.png";
import { useGetBoughtItemsByUsernameQuery } from '../../services/items/itemSlice';

const Shopper = ({ isAuthenticated, authState }: { isAuthenticated: boolean; authState: AuthState }) => {
    const { data: items } = useGetBoughtItemsByUsernameQuery(
        authState.user?.username as string,
    );

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
                <h2 className='text-2xl text-center font-semibold'>Your Buying History</h2>
                <div className="flex flex-row flex-wrap items gap-4">
                    {items?.map((item: any, index: number) => (
                        <div key={index} className='flex flex-col flex-wrap items-center gap-2 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl'>
                            <div className="md:flex">
                                <div className="p-2 pt-6">
                                    <img className="h-48 w-full object-cover" src={item.image ?? defaultItemImage} alt={item.title} />
                                </div>
                                <div className="p-8">
                                    <p className="block text-lg leading-tight font-semibold text-black">{item.title}</p>
                                    <p className="mt-2 text-gray-500">{item.description}</p>
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
                        </div>
                    ))}
                </div>
            </div>
            </>
            ) : (
                <Link to={"/"}>Back to home</Link>
            )}
        </div>
    )
};

export default Shopper;