import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Plus, Search, Clock, CheckCircle, XCircle, 
  User, Mail, Phone, DollarSign, BedDouble
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

function Bookings() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings?ownerId=${userInfo._id}`);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?._id) fetchBookings();
  }, [userInfo]);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-amber-100 text-amber-700',
      'Confirmed': 'bg-blue-100 text-blue-700',
      'Checked In': 'bg-emerald-100 text-emerald-700',
      'Checked Out': 'bg-gray-100 text-gray-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <h2 className="text-lg font-semibold text-gray-800">All Bookings</h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search size={18} className="text-gray-400" />
              <input type="text" placeholder="Search bookings..." className="bg-transparent border-none outline-none ml-2 text-sm w-full" />
            </div>
            <button 
              onClick={() => navigate('/dashboard/add-booking')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={16} /> New Booking
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-500 mb-6">Create your first booking to start tracking revenue.</p>
              <button 
                onClick={() => navigate('/dashboard/add-booking')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Create First Booking
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                              {booking.guestName?.charAt(0) || 'G'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                              <div className="text-xs text-gray-500">{booking.guestEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {booking.property?.name || 'Unknown Property'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.property?.location?.town}, {booking.property?.location?.county}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(booking.checkIn)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(booking.checkOut)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          KES {booking.totalPrice?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Bookings;