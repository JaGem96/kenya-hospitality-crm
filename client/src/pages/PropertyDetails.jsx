import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Users, DollarSign, Star, Calendar, Shield, Wifi, Car
} from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Fetch all properties and find the one with this ID
        // (In a real app, we would have a GET /api/properties/:id endpoint)
        const response = await axios.get('http://localhost:5000/api/properties'); 
        const found = response.data.find(p => p._id === id);
        setProperty(found);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!property) return <div className="flex justify-center items-center h-screen">Property not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
            <ArrowLeft size={20} /> <span className="hidden md:inline">Back to Properties</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
            <Calendar size={16} /> Book Now
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-6xl mx-auto w-full">
          {/* Image Gallery */}
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg h-96 bg-gray-200 relative">
            {property.images && property.images.length > 0 ? (
              <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <MapPin size={64} />
              </div>
            )}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-800 shadow-sm">
              {property.type}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  <span>{property.location?.town}, {property.location?.county} County</span>
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Users size={16} /> {property.rooms?.[0]?.capacity} Guests</span>
                  <span className="flex items-center gap-1"><Star size={16} className="text-amber-500 fill-amber-500" /> 4.9 (12 reviews)</span>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-6">
                <h3 className="text-xl font-semibold mb-2">About this property</h3>
                <p className="text-gray-600 leading-relaxed">{property.description || "A beautiful property perfect for your stay."}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Free WiFi', 'Free Parking', 'Air Conditioning', 'Kitchen', 'Pool', 'Security'].map((amenity, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      {amenity.includes('WiFi') ? <Wifi size={20} /> : amenity.includes('Parking') ? <Car size={20} /> : <Shield size={20} />}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">KES {property.rooms?.[0]?.pricePerNight}</span>
                    <span className="text-gray-500"> / night</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star size={14} className="text-amber-500 fill-amber-500" /> 4.9
                  </div>
                </div>
                
                <div className="border border-gray-300 rounded-lg mb-4 overflow-hidden">
                  <div className="grid grid-cols-2 border-b border-gray-300">
                    <div className="p-3 border-r border-gray-300">
                      <label className="text-xs font-bold text-gray-800 block">CHECK-IN</label>
                      <input type="date" className="w-full text-sm outline-none mt-1" />
                    </div>
                    <div className="p-3">
                      <label className="text-xs font-bold text-gray-800 block">CHECKOUT</label>
                      <input type="date" className="w-full text-sm outline-none mt-1" />
                    </div>
                  </div>
                  <div className="p-3">
                    <label className="text-xs font-bold text-gray-800 block">GUESTS</label>
                    <select className="w-full text-sm outline-none mt-1 bg-transparent">
                      <option>1 guest</option>
                      <option>2 guests</option>
                      <option>3 guests</option>
                    </select>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition shadow-md">
                  Reserve
                </button>
                
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="underline">KES {property.rooms?.[0]?.pricePerNight} x 5 nights</span>
                    <span>KES {property.rooms?.[0]?.pricePerNight * 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline">Cleaning fee</span>
                    <span>KES 2,000</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>KES {(property.rooms?.[0]?.pricePerNight * 5) + 2000}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PropertyDetails;