import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Loader } from '../components/Loader';
import { UserIcon } from '../components/icons/UserIcon';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) {
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      await auth.register(name, email, password, role);
      navigate('/');
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.msg || 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
         <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-transparent to-violet-100 dark:from-pink-900/20 dark:to-violet-900/20 -z-10"></div>
        <div className="max-w-md w-full">
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700/50">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                        Create Your Account
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Get started with your personal AI stylist.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md dark:bg-red-900/30 dark:text-red-300 dark:border-red-600" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                        <input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 mt-4">
                        {loading ? <Loader /> : <UserIcon />}
                        <span>{loading ? 'Creating Account...' : 'Register'}</span>
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    </div>
  );
};

export default RegisterPage;
