import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, DollarSign, Users, Plus, Search, Filter, MoreVertical, Edit, Trash2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

function Properties() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties when the page loads
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // We fetch properties belonging to the logged-in user
        const response = await axios.get(`http://localhost:5000/api/properties?ownerId=${userInfo._id}`);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?._id) {
      fetchProperties();
    }
  }, [userInfo]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <h2 className="text-lg font-semibold text-gray-800">My Properties</h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search size={18} className="text-gray-400" />
              <input type="text" placeholder="Search properties..." className="bg-transparent border-none outline-none ml-2 text-sm w-full" />
            </div>
            <button 
              onClick={() => navigate('/dashboard/add-property')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={16} /> Add New
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No properties yet</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first property to the system.</p>
              <button 
                onClick={() => navigate('/dashboard/add-property')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Add Your First Property
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div 
  key={property._id} 
  onClick={() => navigate(`/dashboard/properties/${property._id}`)}
  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group cursor-pointer"
>
                  {/* Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative">
                    <Building2 className="h-12 w-12 text-blue-300" />
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-700 uppercase tracking-wide">
                      {property.type}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{property.name}</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                      <MapPin size={14} />
                      <span>{property.location?.town}, {property.location?.county}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Starting from</p>
                        <p className="text-lg font-bold text-blue-600">KES {property.rooms?.[0]?.pricePerNight || 0}</p>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Users size={14} />
                        <span>{property.rooms?.[0]?.capacity || 0} Guests</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Properties;