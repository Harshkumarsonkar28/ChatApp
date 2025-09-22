import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../service/api';

const Rooms = () => {
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get(`/api/user/all/${user.id}`);
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [user]);

  const join = () => {
    if (!room.trim()) return alert('Enter room name');
    navigate(`/chat/${room}`);     // going in the chat room with room name
  };

  const privateChat = (otherUserId) => {
    // Create room ID by combining sorted user IDs
    const roomId = [user.id, otherUserId].sort().join('_');
    navigate(`/chat/${roomId}`);
  };

 

  return (
  
    <div className="auth-page">
      
      <h2>Rooms</h2>
      <input placeholder="Room name... Eg: general" value={room} onChange={e => setRoom(e.target.value)} />
      <button onClick={join}>Join Room</button>

      <h3>Private Chat</h3>
      <ul>
        {users.map(u => (
          <li key={u._id}>
            <button onClick={() => privateChat(u._id)}>{u.username}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rooms;


