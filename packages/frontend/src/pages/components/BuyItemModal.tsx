import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import type { BuyItemRequest, ItemModel } from "../../services/items/types";
import { useBuyItemMutation } from "../../services/items/itemSlice";
import type { ErrorResponse } from "../../services/error-types";
import defaultItemImage from "../../../src/images/default-product.png";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const BuyItemModal = ({ open, onClose, item, userId }: { open: boolean; onClose: () => void; item: ItemModel, userId: number }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [buyItem, { isLoading }] = useBuyItemMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const itemData: BuyItemRequest = {
                id: item.id,
                sellerId: item.sellerId,
                title: item.title,
                quantity: quantity,
                buyers: [userId],
            }
            console.log(itemData);
            buyItem(itemData)
                .then((payload) => {
                    if (payload.data?.ok !== undefined && payload.data?.message !== undefined) {
                        if (payload.data?.ok) {
                            alert(payload.data?.message);
                            onClose();
                            return;
                        }
                    }
                    const error = payload.error as ErrorResponse | undefined;
                    alert(error?.message);
                })
                .catch((error) => {
                    console.log("rejected", error);
                });
        } catch (err) {
            alert(`Failed to update item with error: ${err}`);
        }
    };

    return (
        <Modal
        aria-labelledby="buy-item-modal"
        aria-describedby="buy-item-modal"
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
            backdrop: {
            timeout: 500,
            },
        }}
        >
        <Fade in={open}>
            <Box sx={style} className="flex flex-col gap-4 rounded-md">
            <h3 className='text-xl mb-4 text-center font-semibold'>Buy Item</h3>
            <div className='flex flex-col flex-wrap items-center gap-2 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl'>
                <div className="md:flex">
                <div className="p-2">
                    <img className="h-48 w-full object-cover" src={item.image ?? defaultItemImage} alt={item.title} />
                </div>
                <div className="p-8">
                    <div className={`uppercase tracking-wide text-sm font-semibold ${item.status === "sold" || item.status === "disable" ? "text-red-500" : "text-indigo-500"}`}>{item.status}</div>
                        <p className="block mt-1 text-lg leading-tight font-medium text-black">{item.title}</p>
                        <p className="mt-2 text-gray-500">{item.description}</p>
                        <div className="mt-4">
                            <span className="text-gray-900">Price: </span>
                            <span className="text-gray-900 font-bold">${item.price}</span>
                        </div>
                        <div className="mt-2">
                            <span className="text-gray-900">Available Quantity: </span>
                            <span className="text-gray-900 font-bold">{item.quantity}</span>
                        </div>
                        <div className="mt-4">
                            <span className="text-gray-900">Seller: </span>
                            <span className="text-gray-900 font-bold">{item.sellerUserName}</span>
                        </div>
                        <form onSubmit={handleSubmit} className="mt-4">
                            <label className="block mb-2 text-sm font-medium">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                placeholder="Quantity"
                                className="bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.min(item.quantity, parseInt(e.target.value)))}
                                required
                                min={1}
                                max={item.quantity}
                            />
                            <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-lg mt-4">
                                {isLoading ? "Loading..." : "Buy Item"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            </Box>
        </Fade>
        </Modal>
    );
};

export default BuyItemModal;