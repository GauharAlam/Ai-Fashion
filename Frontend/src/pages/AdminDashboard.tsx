import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getAllUsers, deleteUser } from '../services/authService';
import type { AuthUser } from '../types';
import { Loader } from '../components/Loader';
import { AdminIcon } from '../components/icons/AdminIcon';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const auth = useContext(AuthContext);
  const currentUser = auth?.user;

  useEffect(() => {
    const fetchUsers = async () => {
        try {
          const usersData = await getAllUsers();
          // The API returns MongoDB's `_id`, let's map it to `id` for consistency
          const mappedUsers = usersData.map(u => ({...u, id: (u as any)._id}));
          setUsers(mappedUsers);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load users.');
        } finally {
          setLoading(false);
        }
      };
    
      fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        try {
            await deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user.');
        }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="text-pink-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50">
                <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 flex items-center gap-3">
                        <AdminIcon />
                        Admin Dashboard
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Manage all registered users in the system.</p>
                </div>
                
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md dark:bg-red-900/30 dark:text-red-300 dark:border-red-600 mb-4" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 font-semibold text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 font-semibold text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 font-semibold text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                        <tr key={user.id}>
                        <td className="px-4 py-3 whitespace-nowrap">{user.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === 'admin' 
                                ? 'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-200' 
                                : 'bg-violet-100 text-violet-800 dark:bg-violet-800 dark:text-violet-200'
                            }`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                            <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === currentUser?.id}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                            Delete
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
