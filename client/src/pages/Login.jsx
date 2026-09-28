import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // CRITICAL: This prevents the form from doing a normal HTML submission
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);

    try {
      console.log('Sending login request to backend...');
      
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      console.log('Login successful:', response.data);
      
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      
      toast.success(`Welcome back, ${response.data.name}!`);
      
      setTimeout(() => navigate('/dashboard'), 1000);

    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.message || 'Login failed. Check credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            🇰🇪 Kenya Hospitality CRM
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your properties and bookings
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="manager@serenahotels.co.ke"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in to Dashboard'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            New to the platform?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;