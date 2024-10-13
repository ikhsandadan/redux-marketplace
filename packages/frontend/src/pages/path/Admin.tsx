import { useState } from "react";
import { Link } from "react-router-dom";
import LogOutButton from "../auth/LogOutButton";
import type { AuthState } from "../../services/auth/types";
import { useGetAllUsersQuery } from "../../services/items/itemSlice";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Tooltip from '@mui/material/Tooltip';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import type { ErrorResponse } from "../../services/error-types";
import { useDeleteUserMutation } from "../../services/items/itemSlice";
import DeleteUserModal from "../components/DeleteUserModal";
import RegisterModal from "../components/RegisterModal";
import EditUserModal from "../components/EditUserModal";
import type { UserUpdateRequest } from "../../services/items/types";

const Admin = ({
	isAuthenticated,
	authState,
}: { isAuthenticated: boolean; authState: AuthState }) => {
	const { data: allUsers } = useGetAllUsersQuery();
	const [deletePost] = useDeleteUserMutation();
	const [userIdToDelete, setUserIdToDelete] = useState(0);
	const [userNameToDelete, setUserNameToDelete] = useState("");
	const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
	const handleDeleteUserModalClose = () => setOpenDeleteUserModal(false);
	const [openRegisterModal, setOpenRegisterModal] = useState(false);
	const handleRegisterModalClose = () => setOpenRegisterModal(false);
	const [openEditUserModal, setOpenEditUserModal] = useState(false);
	const handleEditUserModalClose = () => setOpenEditUserModal(false);
	const [editFormData, setEditFormData] = useState<UserUpdateRequest>({
		id: 0,
		username: "",
		email: "",
		password: "",
		role: "",
	});

	const handleDeleteUserButton = (userid: number, username: string) => {
		setUserIdToDelete(userid);
		setUserNameToDelete(username);
		setOpenDeleteUserModal(true);
	};

	const handleEditUserButton = (userid: number, username: string, email: string, password: string, role: string) => {
		setEditFormData({
			id: userid,
			username: username,
			email: email,
			password: password,
			role: role
		});
		setOpenEditUserModal(true);
	};

	const deleteUser = async (userid: number) => {
		deletePost({ id: userid })
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
			.finally(() => {
				setOpenDeleteUserModal(false);
			});
	};

	return (
    	<div className="card">
        	{isAuthenticated ? (
            	<div className="flex justify-between">
					<div className="flex flex-col text-2xl font-semibold">
						<h2>
							Welcome {authState.user?.role} {authState.user?.username} {" "}
						</h2>
						<div className="max-h-2">
							<Link to={"/"} className="text-blue-600">Back to home</Link>
						</div>
					</div>
					<LogOutButton />
				</div>
        	) : (
            	<Link to={"/"}>You're not authorized as admin. Back to home</Link>
        	)}

        	{isAuthenticated ? (
            	<>
				<div className="card">
					<h2 className="text-2xl font-semibold text-center">List of all users</h2>
					<table className='w-full border-collapse'>
						<caption className="caption-top py-2">
							<div className='grid'>
								<Tooltip title="Add New User" className='place-self-end'>
									<IconButton aria-label="add" onClick={() => setOpenRegisterModal(true)}>
										<PersonAddIcon/>
									</IconButton>
								</Tooltip>
							</div>
						</caption>
						<thead>
							<tr className='bg-gray-300'>
								<th className='p-2 text-left font-bold'>#</th>
								<th className='p-2 text-left font-bold'>ID</th>
								<th className='p-2 text-left font-bold'>User Name</th>
								<th className='p-2 text-right font-bold'>Email</th>
								<th className='p-2 text-left font-bold'>Role</th>
								<th className='p-2 text-right font-bold'>Actions</th>
							</tr>
						</thead>
						<tbody>
							{allUsers?.map((user, index) => (
								<tr key={index} className="border-b last:border-b-0">
									<td className='p-2 text-left font-semibold'>{index + 1}</td>
									<td className='p-2 text-left'>{user.id}</td>
									<td className='p-2 text-left'>{user.username}</td>
									<td className='p-2 text-right'>{user.email}</td>
									<td className='p-2 text-left'>{user.role}</td>
									{authState.user?.username !== user.username ? (
										<td className='p-2 text-right'>
											<Tooltip title="Edit User">
											<IconButton aria-label="edit" onClick={() => handleEditUserButton(user.id, user.username, user.email, user.password, user.role)}>
												<EditNoteIcon />
											</IconButton>
											</Tooltip>
											<Tooltip title="Delete User">
											<IconButton aria-label="delete" onClick={() => handleDeleteUserButton(user.id, user.username)}>
												<DeleteForeverIcon className='text-red-600'/>
											</IconButton>
											</Tooltip>
										</td>
									) : (null)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
            	</>
        	) : (null)}
			<DeleteUserModal open={openDeleteUserModal} onClose={handleDeleteUserModalClose} userid={userIdToDelete} username={userNameToDelete} deleteUser={deleteUser}/>
			<RegisterModal open={openRegisterModal} onClose={handleRegisterModalClose}/>
			<EditUserModal open={openEditUserModal} onClose={handleEditUserModalClose} formData={editFormData} setFormData={setEditFormData}/>
    	</div>
	);
};

export default Admin;