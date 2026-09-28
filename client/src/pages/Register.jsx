import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'guest'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log('Success:', response.data);
      toast.success('Account created! Please login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error('Error:', error);
      const msg = error.response?.data?.message || 'Registration failed. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Join the Network</h2>
          <p className="mt-2 text-sm text-gray-600">Register your property or book your next stay</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="John Kamau" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <select name="role" value={formData.role} onChange={handleChange} className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="guest">Guest / Traveler</option>
                  <option value="bnb_host">BnB Host</option>
                  <option value="hotel_owner">Hotel Owner / Manager</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;