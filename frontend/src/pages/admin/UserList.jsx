import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from 'react-toastify';
import Loader from "../../components/Loader";
import { 
    useGetUsersQuery, 
    useDeleteUserMutation, 
    useGetUserDetailsQuery, 
    useUpdateUserMutation 
} from "../../redux/api/usersApiSlice";
import Message from "../../components/Message";

const UserList = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const [editableUserName, setEditableUserName] = useState('');
    const [editableUserId, setEditableUserId] = useState(null);
    const [editableUserEmail, setEditableUserEmail] = useState('');

    useEffect(() => {
        refetch();
    }, [refetch]);

    // Enable edit mode and store current values
    const toggleEdit = (id, username, email) => {
        setEditableUserId(id);
        setEditableUserName(username);
        setEditableUserEmail(email);
    };

    // Handle updating user details
    const updateHandler = async (id) => {
        try {
            await updateUser({
                userId: id,
                username: editableUserName,
                email: editableUserEmail,
            });
            setEditableUserId(null);
            refetch();
            toast.success("User updated successfully");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    // Handle deleting a user
    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(id);
                refetch();
                toast.success("User deleted successfully");
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Users</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error?.message}
                </Message>
            ) : (
                <div className="flex flex-col md:flex-row overflow-x-auto">
                    <table className="w-full md:w-4/5 mx-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">ID</th>
                                <th className="px-4 py-2 text-left">NAME</th>
                                <th className="px-4 py-2 text-left">EMAIL</th>
                                <th className="px-4 py-2 text-left">ADMIN</th>
                                <th className="px-4 py-2 text-left">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b">
                                    {/* ID Column */}
                                    <td className="px-4 py-2">{user._id}</td>

                                    {/* Name Column with Inline Edit */}
                                    <td className="px-4 py-2">
                                        {editableUserId === user._id ? (
                                            <div className="flex items-center">
                                                <input 
                                                    type="text" 
                                                    value={editableUserName} 
                                                    onChange={(e) => setEditableUserName(e.target.value)} 
                                                    className="w-full p-2 border rounded-lg" 
                                                />
                                                <button 
                                                    onClick={() => updateHandler(user._id)} 
                                                    className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                                                >
                                                    <FaCheck />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                {user.username}
                                                <button onClick={() => toggleEdit(user._id, user.username, user.email)}>
                                                    <FaEdit className="ml-[1rem] text-blue-500" />
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    {/* Email Column */}
                                    <td className="px-4 py-2">
                                        {editableUserId === user._id ? (
                                            <input 
                                                type="email" 
                                                value={editableUserEmail} 
                                                onChange={(e) => setEditableUserEmail(e.target.value)} 
                                                className="w-full p-2 border rounded-lg" 
                                            />
                                        ) : (
                                            
                                          
                                                   <div className="flex items-center">
                                                {user.email}
                                                <button onClick={() => toggleEdit(user._id, user.username, user.email)}>
                                                    <FaEdit className="ml-[1rem] text-blue-500" />
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    {/* Admin Status Column */}
                                    <td className="px-4 py-2">
                                        {user.isAdmin ? (
                                            <FaCheck style={{ color: "green" }} />
                                        ) : (
                                            <FaTimes style={{ color: "red" }} />
                                        )}
                                    </td>

                                    {/* Actions Column (Delete) */}
                                    <td className="px-4 py-2">
                                        {!user.isAdmin && (
                                            <button 
                                                onClick={() => deleteHandler(user._id)}
                                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserList;