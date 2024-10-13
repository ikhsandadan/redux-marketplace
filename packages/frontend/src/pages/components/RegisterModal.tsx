import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import { useRegisterMutation } from "../../services/auth/authSlice";
import type { RegisterRequest } from "../../services/auth/types";

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

const RegisterModal = ({
    open, 
    onClose,
} :  { open: boolean, onClose: () => void }) => {
    const [register] = useRegisterMutation();
	const [registerFormData, setRegisterFormData] = useState<RegisterRequest>({
    	username: "",
    	email: "",
    	password: "",
		role: "admin",
	});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            register(registerFormData)
                .then((data) => {
                    if (data?.data?.ok) {
                        setRegisterFormData({
                            username: "",
                            email: "",
                            password: "",
                            role: "admin",
                        })
                        onClose();
                        alert("Successfully registered new user!");
                        return true;
                    }
                    alert("Invalid credentials!");
                })
                .catch(() =>
                    alert("Server error! Please file a bug report!"),
                );
        } catch (err) {
            alert(`Failed to register; got ${err}`);
        }
    };

    const handleClose = () => {
        setRegisterFormData({
            username: "",
            email: "",
            password: "",
            role: "admin",
        })
        onClose();
    };

    return (
        <Modal
			aria-labelledby="register-user-modal"
			aria-describedby="register-user-modal"
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
					<h3 className='text-xl mb-4 text-center font-semibold'>Register new user</h3>
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
                                value={registerFormData.username}
                                onChange={(e) =>
                                    setRegisterFormData({
                                        ...registerFormData,
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
                                value={registerFormData.email}
                                onChange={(e) =>
                                    setRegisterFormData({
                                        ...registerFormData,
                                        email: e.target.value,
                                    })
                                }
                            />
                            <label className='block mb-2 pt-2 text-sm font-medium'>Password</label>
                            <input
                                type="password"
                                name='password'
                                autoComplete='password'
                                id="password"
                        	    placeholder="Password"
                                data-required='true'
                                className='bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1'
                                value={registerFormData.password}
                                onChange={(e) =>
                                    setRegisterFormData({
                                        ...registerFormData,
                                        password: e.target.value,
                                    })
                                }
                            />
                            <label className='block mb-2 pt-2 text-sm font-medium'>Role</label>
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
                            <div className="flex justify-center gap-2 mt-4 pt-2">
                                <button className='bg-green-500'>Register</button>
                                <button type='button' className='bg-red-500' onClick={handleClose}>Cancel</button>
                            </div>
                        </div>
                    </form>
				</Box>
			</Fade>
		</Modal>
    )
}

export default RegisterModal;