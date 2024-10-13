import { useState, Dispatch, SetStateAction } from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import type { ItemUpdateRequest } from "../../services/items/types";
import { useUpdateItemMutation } from "../../services/items/itemSlice";
import type { ErrorResponse } from "../../services/error-types";

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

const EditItemModal = ({
    open, 
    onClose,
    formData,
    setFormData,
    convertToBase64,
} :  { open: boolean, onClose: () => void, formData: ItemUpdateRequest, setFormData: Dispatch<SetStateAction<ItemUpdateRequest>>, convertToBase64: Function }) => {
    const [updateItem] = useUpdateItemMutation();
    const [itemImage, setItemImage] = useState<string>(formData.image);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
        	updateItem(formData)
            	.then((payload) => {
                	if (
                    	payload.data?.ok !== undefined &&
                    	payload.data?.message !== undefined
                	) {
                    	if (payload.data?.ok) {
                        	alert(payload.data?.message);
                        	handleCloseButton();
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
        	alert(`Failed to update user with error: ${err}`);
    	}
    };

    const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const base64 = await convertToBase64(file!);
        setItemImage(base64 as string);
        setFormData({ ...formData, image: base64 as string });
    };

    const handleCloseButton = () => {
        setItemImage(formData.image);
        onClose();
    };

    return (
        <Modal
			aria-labelledby="edit-user-modal"
			aria-describedby="edit-user-modal"
			open={open}
			onClose={handleCloseButton}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
                backdrop: {
                    timeout: 500,
                },
			}}
		>
			<Fade in={open}>
				<Box sx={style} className="rounded-md">
					<h3 className='text-xl mb-4 text-center font-semibold'>Edit item</h3>
                    <form action="register" className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
                        <div className='space-y-1'>
                            <label className='block mb-2 text-sm font-medium'>Title</label>
                            <input
                                type="text"
                                name='title'
                                autoComplete='title'
                                id="title"
                        	    placeholder="Title"
                                data-required='true'
                                className='bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1'
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                            />
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
                            <label className='block mb-2 pt-2 text-sm font-medium'>Price</label>
                            <div className='flex'>
                                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">$</span>
                                <input
                                    type="number"
                                    name='price'
                                    autoComplete='price'
                                    id="price"
                                    placeholder="Price"
                                    data-required='true'
                                    className='bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1'
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price: parseInt(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <label className='block mb-2 pt-2 text-sm font-medium'>Quantity</label>
                            <input
                                type="number"
                                name='quantity'
                                autoComplete='quantity'
                                id="quantity"
                        	    placeholder="Quantity"
                                data-required='true'
                                className='bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1'
                                value={formData.quantity}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        quantity: parseInt(e.target.value),
                                    })
                                }
                            />
                            <label className='block mb-2 pt-2 text-sm font-medium'>Description</label>
                            <input
                                type="text"
                                name='description'
                                autoComplete='description'
                                id="description"
                        	    placeholder="Description"
                                data-required='true'
                                className='bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1'
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                            />
                            <label className='block mb-2 pt-2 text-sm font-medium'>Status</label>
                            <select 
                                id="status" 
                                name="status"
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        status: e.target.value,
                                    })
                                }
                                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                >
                                <option value="available">Available</option>
                                <option value="sold">Sold Out</option>
                                <option value="disabled">Disable</option>
                            </select>
                            <div className="flex justify-center gap-2 mt-4 pt-2">
                                <button className='bg-green-500'>Update</button>
                                <button type='button' className='bg-red-500' onClick={handleCloseButton}>Cancel</button>
                            </div>
                        </div>
                    </form>
				</Box>
			</Fade>
		</Modal>
    )
}

export default EditItemModal;