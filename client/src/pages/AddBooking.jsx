import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, User, Mail, Phone, ArrowLeft, Save, Building2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

function AddBooking() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    propertyId: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: '',
    checkOut: ''
  });

  // Fetch user's properties for the dropdown
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/properties?ownerId=${userInfo._id}`);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    if (userInfo?._id) fetchProperties();
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        ...formData,
        ownerId: userInfo._id
      };

      await axios.post('http://localhost:5000/api/bookings', bookingData);
      
      toast.success('Booking created successfully!');
      setTimeout(() => navigate('/dashboard/bookings'), 1000);
    } catch (error) {
      console.error('Booking error:', error);
      const msg = error.response?.data?.message || 'Failed to create booking';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
              <ArrowLeft size={20} /> <span className="hidden md:inline">Back</span>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">Create New Booking</h2>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Property Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 size={20} className="text-blue-600" /> Select Property
                </h3>
                <select
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">-- Choose a property --</option>
                  {properties.map((prop) => (
                    <option key={prop._id} value={prop._id}>
                      {prop.name} ({prop.location?.town}, {prop.location?.county}) - KES {prop.rooms?.[0]?.pricePerNight}/night
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-emerald-600" /> Guest Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="John Kamau"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Mail size={14} /> Email
                    </label>
                    <input
                      type="email"
                      name="guestEmail"
                      value={formData.guestEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Phone size={14} /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="guestPhone"
                      value={formData.guestPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>
              </div>

              {/* Booking Dates */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-amber-600" /> Booking Dates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-In Date</label>
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out Date</label>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/bookings')}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 shadow-sm"
                >
                  <Save size={18} /> {loading ? 'Creating...' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddBooking;