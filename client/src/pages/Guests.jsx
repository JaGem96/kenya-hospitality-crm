import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Mail, Phone, Calendar, DollarSign, 
  Crown, Star, TrendingUp
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

function Guests() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessGuests = async () => {
      try {
        // Fetch all bookings for this owner
        const response = await axios.get(`http://localhost:5000/api/bookings?ownerId=${userInfo._id}`);
        const bookings = response.data;

        // Smart Logic: Group bookings by guest email to find unique guests
        const guestMap = {};
        
        bookings.forEach(booking => {
          const email = booking.guestEmail?.toLowerCase();
          if (!email) return;

          if (!guestMap[email]) {
            guestMap[email] = {
              name: booking.guestName,
              email: email,
              phone: booking.guestPhone || 'N/A',
              stays: 0,
              totalSpent: 0,
              lastStay: booking.checkIn
            };
          }
          
          // Update stats
          guestMap[email].stays += 1;
          guestMap[email].totalSpent += booking.totalPrice || 0;
          
          // Keep track of most recent stay
          if (new Date(booking.checkIn) > new Date(guestMap[email].lastStay)) {
            guestMap[email].lastStay = booking.checkIn;
          }
        });

        // Convert map to array and sort by total spent (VIPs first)
        const guestList = Object.values(guestMap).sort((a, b) => b.totalSpent - a.totalSpent);
        setGuests(guestList);

      } catch (error) {
        console.error('Error fetching guests:', error);
        toast.error('Failed to load guest directory');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?._id) fetchAndProcessGuests();
  }, [userInfo]);

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
          <h2 className="text-lg font-semibold text-gray-800">Guest Directory</h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search size={18} className="text-gray-400" />
              <input type="text" placeholder="Search guests..." className="bg-transparent border-none outline-none ml-2 text-sm w-full" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : guests.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No guests yet</h3>
              <p className="text-gray-500 mb-6">Your guest directory will populate automatically as you create bookings.</p>
              <button 
                onClick={() => navigate('/dashboard/add-booking')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Create First Booking
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Your Customers</h3>
                  <p className="text-sm text-gray-500">Sorted by highest lifetime value</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Users size={12} /> {guests.length} Total Guests
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stays</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Stay</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lifetime Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {guests.map((guest, index) => (
                      <tr key={guest.email} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white mr-3 ${
                              index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 
                              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                              'bg-gradient-to-br from-blue-400 to-indigo-600'
                            }`}>
                              {guest.name?.charAt(0) || 'G'}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                {guest.name}
                                {index === 0 && <Crown size={14} className="text-amber-500" />}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center gap-1">
                            <Mail size={12} className="text-gray-400" /> {guest.email}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Phone size={10} className="text-gray-400" /> {guest.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-semibold flex items-center gap-1 w-fit">
                            <Calendar size={12} /> {guest.stays} {guest.stays === 1 ? 'Stay' : 'Stays'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(guest.lastStay)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                            <TrendingUp size={14} /> KES {guest.totalSpent.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {guest.stays >= 3 ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 items-center gap-1">
                              <Star size={10} fill="currentColor" /> VIP Guest
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Regular
                            </span>
                          )}
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

export default Guests;