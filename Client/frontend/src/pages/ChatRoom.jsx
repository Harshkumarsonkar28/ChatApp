import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../service/api';
import { AuthContext } from '../context/AuthContext';
import Message from '../components/Message';
import MessageInput from '../components/MessageInput';


const API_URL = 'https://chatapp-zc3f.onrender.com';

const ChatRoom = () => {
  const { roomName } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [editMsg,setEditMsg] = useState(null);
  const socketRef = useRef(null);

  const socket = useMemo(() => io(API_URL, { transports: ['websocket'] }), []);

  useEffect(() => {
    socketRef.current = socket;
    socketRef.current.emit('joinRoom', roomName);

    socketRef.current.on('message', data => {
      setMessages(prev => {
        if (!prev) prev = [];
        if (prev.some(m => m._id === data._id)) return prev;
        return [...prev, data];
      });
    });

    socketRef.current.on('sendMessage',(msg)=>{
      setMessages((prev)=>[...prev,msg])
    });

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/message/${roomName}`);
        setMessages(res.data.message || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();

    return () => {
      socketRef.current.off('message');
      socketRef.current.disconnect();
    };
  }, [roomName, socket]);

  const handleSend = async content => {
    if (!content) return;

if(editMsg){
  try {
    const res = await api.put(`/api/message/${editMsg._id}`,{content});
    setMessages((prev)=>{
      prev.map(m=>(m._id === editMsg._id ? res.data.message : m))
    });
    socketRef.current.emit('editMessage',{messageId: editMsg._id,
      updatedMessage: res.data.message.content,
      room: roomName,});
    setEditMsg(null);
  } catch (error) {
    console.log(error)
  }
  return;
}

    const payload = { sender: user.id, content, chatRoom: roomName };
    try {
      const res = await api.post('/api/message', payload);
      setMessages(prev => [...prev, res.data]);
      socketRef.current.emit('chatMessage', res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (message)=>{
   setEditMsg(message);
  }

   const handleDelete = async(id)=>{
   try {
    await api.delete(`/api/message/${id}`)
    setMessages((prev)=>prev.filter(m => m._id !== id));
    socketRef.current.emit('delteMessage',{id,room:roomName})
   } catch (error) {
    console.log(error)
   }
  }

  return (
    <div className="chat-page">
      <h3>Room: {roomName}</h3>
      <div className="messages">
        {messages && messages.map(msg => <Message key={msg._id} message={msg} meId={user.id} onDelete={handleDelete} onEdit={handleEdit} />
        )} 
      </div>
      <MessageInput onSend={handleSend} intialValue={editMsg?editMsg.content :''} />
    </div>
  );
};

export default ChatRoom;




