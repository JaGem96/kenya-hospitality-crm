import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, DollarSign, Users, Save, ArrowLeft, Image as ImageIcon, Upload
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

function AddProperty() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '', type: 'BnB', county: '', town: '', address: '',
    pricePerNight: '', capacity: '', description: '', image: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload (Convert to Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        name: formData.name, type: formData.type,
        location: { county: formData.county, town: formData.town, address: formData.address },
        rooms: [{ type: 'Standard', pricePerNight: Number(formData.pricePerNight), capacity: Number(formData.capacity), isAvailable: true }],
        description: formData.description,
        images: formData.image ? [formData.image] : [], // Save image array
        ownerId: userInfo._id
      };

      await axios.post('http://localhost:5000/api/properties', propertyData);
      toast.success('Property added successfully!');
      setTimeout(() => navigate('/dashboard/properties'), 1500);

    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property');
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
            <h2 className="text-lg font-semibold text-gray-800">Add New Property</h2>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Image Upload Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon size={20} className="text-purple-600" /> Property Image
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Upload size={40} className="mb-2" />
                      <p className="font-medium">Click to upload property image</p>
                      <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 size={20} className="text-blue-600" /> Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Serena Beach Villa" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="BnB">Bed & Breakfast (BnB)</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Airbnb">Airbnb / Apartment</option>
                      <option value="Hostel">Hostel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Brief description..." />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-emerald-600" /> Location Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                    <input type="text" name="county" value={formData.county} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Mombasa" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Town / Area</label>
                    <input type="text" name="town" value={formData.town} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Diani" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Beach Road" />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign size={20} className="text-amber-600" /> Pricing & Capacity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night (KES)</label>
                    <input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="5000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Users size={14} /> Guest Capacity</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="2" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button type="button" onClick={() => navigate('/dashboard/properties')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 shadow-sm">
                  <Save size={18} /> {loading ? 'Saving...' : 'Save Property'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddProperty;