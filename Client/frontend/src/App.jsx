import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import ChatRoom from './pages/ChatRoom';

import './style.css';


// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;

  // if(user){
  //   return children
  // }
  // else{
  //   return <Navigate to="/login" />
  // }
  
};

const App = () => {
 const { user } = useContext(AuthContext);
  return (
    <>
        <Navbar />
       {user && (
  <h1 className='h1-user'>Welcome {user.username}</h1>
   )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/rooms"
            element={
              <PrivateRoute>
                <Rooms />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat/:roomName"
            element={
              <PrivateRoute>
                <ChatRoom />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/rooms" />} />
        
        </Routes>
      </>
  );
};

export default App;
