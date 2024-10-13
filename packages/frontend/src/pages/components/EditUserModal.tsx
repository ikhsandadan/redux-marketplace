import { useState, Dispatch, SetStateAction } from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import type { UserUpdateRequest } from "../../services/items/types";
import { useUpdateUserMutation } from "../../services/items/itemSlice";
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

const EditUserModal = ({
    open, 
    onClose,
    formData,
    setFormData,
} :  { open: boolean, onClose: () => void, formData: UserUpdateRequest, setFormData: Dispatch<SetStateAction<UserUpdateRequest>> }) => {
    const [updateUser] = useUpdateUserMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
        	updateUser(formData)
            	.then((payload) => {
                	if (
                    	payload.data?.ok !== undefined &&
                    	payload.data?.message !== undefined
                	) {
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
        	alert(`Failed to update user with error: ${err}`);
    	}
    };

    return (
        <Modal
			aria-labelledby="edit-user-modal"
			aria-describedby="edit-user-modal"
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
				<Box sx={style} className="rounded-md">
					<h3 className='text-xl mb-4 text-center font-semibold'>Edit user</h3>
                    <form action="register" className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
                        <div className='space-y-1'>
                            <label className='block mb-2 text-sm font-medium'>Username</label>
                            <input
                                type="text"
                                name='username'
                                autoComplete='username'
                                id="username"
                        	    placeholder="Username"
                                data-required='true'
                                className='bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1'
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        username: e.target.value,
                                    })
                                }
                            />
                            <label className='block mb-2 pt-2 text-sm font-medium'>Email</label>
                            <input
                                type="email"
                                name='email'
                                autoComplete='email'
                                id="email"
                        	    placeholder="Email"
                                data-required='true'
                                className='bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1'
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                            />
                            <label className='block mb-2 pt-2 text-sm font-medium'>Role</label>
                            <select 
                                id="role" 
                                name="role"
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        role: e.target.value,
                                    })
                                }
                                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                >
                                <option value="admin">Admin</option>
                                <option value="seller">Seller</option>
                                <option value="shopper">Shopper</option>
                            </select>
                            <div className="flex justify-center gap-2 mt-4 pt-2">
                                <button className='bg-green-500'>Update</button>
                                <button type='button' className='bg-red-500' onClick={onClose}>Cancel</button>
                            </div>
                        </div>
                    </form>
				</Box>
			</Fade>
		</Modal>
    )
}

export default EditUserModal;