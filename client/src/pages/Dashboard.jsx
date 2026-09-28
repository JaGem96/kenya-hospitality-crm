import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Search, Plus, ArrowUpRight, ArrowDownRight, Activity,
  DollarSign, BedDouble, Calendar, Building2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // --- REAL DATA STATE ---
  const [stats, setStats] = useState({
    totalProperties: 0,
    potentialRevenue: 0,
    activeBookings: 0,
    totalCapacity: 0 ,
    totalRevenue: 0
  });

   // --- FETCH REAL DATA FROM BACKEND ---
  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        if (!userInfo?._id) return;
        
        // 1. Fetch Property Stats
        const propResponse = await axios.get(`http://localhost:5000/api/properties/stats?ownerId=${userInfo._id}`);
        
        // 2. Fetch Booking Stats
        const bookResponse = await axios.get(`http://localhost:5000/api/bookings/stats?ownerId=${userInfo._id}`);
        
        // 3. Combine them into one state object
        setStats({
          ...propResponse.data,
          activeBookings: bookResponse.data.activeBookings || 0,
          totalRevenue: bookResponse.data.totalRevenue || 0
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    };
    fetchAllStats();
  }, [userInfo]);

  // --- MOCK CHART DATA (We will make these real later) ---
  const revenueData = [
    { name: 'Mon', revenue: 45000 }, { name: 'Tue', revenue: 52000 },
    { name: 'Wed', revenue: 38000 }, { name: 'Thu', revenue: 65000 },
    { name: 'Fri', revenue: 89000 }, { name: 'Sat', revenue: 120000 },
    { name: 'Sun', revenue: 95000 },
  ];

  const occupancyData = [
    { name: 'Week 1', rate: 45 }, { name: 'Week 2', rate: 52 },
    { name: 'Week 3', rate: 48 }, { name: 'Week 4', rate: 78 },
  ];

  const propertyTypeData = [
    { name: 'BnB', value: 45, color: '#3b82f6' },
    { name: 'Hotel', value: 30, color: '#10b981' },
    { name: 'Airbnb', value: 15, color: '#f59e0b' },
    { name: 'Hostel', value: 10, color: '#8b5cf6' },
  ];

  const recentActivities = [
    { id: 1, text: 'New property "Serena Beach Hotel" added', time: 'Just now', icon: <Building2 size={16} />, color: 'text-blue-600 bg-blue-100' },
    { id: 2, text: 'System update completed', time: '1 hour ago', icon: <Activity size={16} />, color: 'text-emerald-600 bg-emerald-100' },
  ];
  // --- DYNAMIC STATS CARDS ---
  const displayStats = [
        { 
      title: 'Total Revenue', 
      value: `KES ${(stats.totalRevenue || 0).toLocaleString()}`, // <-- CHANGE THIS
      icon: <DollarSign className="h-5 w-5 text-emerald-600" />, 
      bg: 'bg-emerald-50', 
      trend: '+12%', 
      up: true 
    },
    { 
      title: 'Total Capacity', 
      value: stats.totalCapacity, 
      icon: <BedDouble className="h-5 w-5 text-blue-600" />, 
      bg: 'bg-blue-50', 
      trend: '+5%', 
      up: true 
    },
    { 
      title: 'Active Bookings', 
      value: stats.activeBookings, 
      icon: <Calendar className="h-5 w-5 text-amber-600" />, 
      bg: 'bg-amber-50', 
      trend: '0%', 
      up: true 
    },
    { 
      title: 'Total Properties', 
      value: stats.totalProperties, 
      icon: <Building2 className="h-5 w-5 text-purple-600" />, 
      bg: 'bg-purple-50', 
      trend: '+1', 
      up: true 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search size={18} className="text-gray-400" />
              <input type="text" placeholder="Search properties..." className="bg-transparent border-none outline-none ml-2 text-sm w-full" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {userInfo?.name?.split(' ')[0]}! 👋</h2>
              <p className="text-blue-100 max-w-xl">Here is your live business overview.</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/add-property')}
              className="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition shadow-sm flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={18} /> Add Property
            </button>
          </div>

          {/* Stats Grid - USING displayStats NOW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {displayStats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg ${stat.bg}`}>{stat.icon}</div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${stat.up ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                    {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {stat.trend}
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                <select className="text-sm border-gray-200 border rounded-lg px-3 py-1 outline-none">
                  <option>Last 7 Days</option>
                </select>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Property Distribution</h3>
              </div>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={propertyTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {propertyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
                <Activity size={18} className="text-gray-400" />
              </div>
              <div className="flex-1 overflow-y-auto max-h-[350px] space-y-3 pr-2 custom-scrollbar">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition border border-gray-100">
                    <div className={`p-2 rounded-lg ${activity.color} mt-1 flex-shrink-0`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Occupancy Trend</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="rate" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;