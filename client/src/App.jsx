import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
   import AddProperty from './pages/AddProperty';
      import Properties from './pages/Properties';
         import Bookings from './pages/Bookings';
   import AddBooking from './pages/AddBooking';
   import Guests from './pages/Guests';
   import PropertyDetails from './pages/PropertyDetails';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
             <Route 
     path="/dashboard/add-property" 
     element={
       <ProtectedRoute>
         <AddProperty />
       </ProtectedRoute>
     } 
   />
      <Route 
     path="/dashboard/properties" 
     element={
       <ProtectedRoute>
         <Properties />
       </ProtectedRoute>
     } 
   />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
  path="/dashboard/bookings" 
  element={
    <ProtectedRoute>
      <Bookings />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/dashboard/add-booking" 
  element={
    <ProtectedRoute>
      <AddBooking />
    </ProtectedRoute>
  } 
/>
   <Route 
     path="/dashboard/guests" 
     element={
       <ProtectedRoute>
         <Guests />
       </ProtectedRoute>
     } 
   />
   <Route 
  path="/dashboard/properties/:id" 
  element={
    <ProtectedRoute>
      <PropertyDetails />
    </ProtectedRoute>
  } 
/>
        </Routes>
      </div>
    </Router>
  );
}


export default App;