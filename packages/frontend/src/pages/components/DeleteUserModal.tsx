import React from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';

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

const DeleteUserModal = ({
    open, 
    onClose,
    userid,
    username,
    deleteUser
} :  {open: boolean, onClose: () => void, userid: number, username: string, deleteUser: (id: number) => void }) => {
    return (
        <Modal
			aria-labelledby="delete-user-modal"
			aria-describedby="delete-user-modal"
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
					<h3 className='text-xl mb-4'>Are you sure you want to delete {username} from the user?</h3>
					<div className="flex justify-center gap-2">
						<button onClick={() => deleteUser(userid)} className='bg-red-500'>Delete</button>
						<button onClick={onClose}>Cancel</button>
					</div>
				</Box>
			</Fade>
		</Modal>
    )
}

export default DeleteUserModal;