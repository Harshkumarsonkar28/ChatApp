const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const cors = require('cors');
const DbConnection = require('./config/db');
const UserRoute = require('./routes/userRoute');
const MessageRoute = require('./routes/messageRoute');
const Message = require('./models/messageModel');


dotenv.config();
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

DbConnection();
app.use(cors());
app.use(express.json());


// API Routes
app.use('/api/user', UserRoute);
app.use('/api/message', MessageRoute);

app.get('/', (req, res) => res.send("Hello"));

// Socket.IO Setup

const io = new Server(server, {
  cors: { origin: "https://chatapp-1-7k7d.onrender.com", methods: ['GET', 'POST'] },
  transports: ['websocket']
});

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('joinRoom', room => socket.join(room));
  socket.on('chatMessage', async data => {
    const message = new Message(data);
    await message.save();
    io.to(data.chatRoom).emit('message', message);
  });
  socket.on('sendMessage',async({room,message})=>{
    io.to(room).emit('newMessage',message);
  })
  
    socket.on('editMessage',async({messageId,updatedMessage,room})=>{
      await Message.findByIdAndUpdate(messageId,{content:updatedMessage},{new:true});
      io.to(room).emit('messageEdit',{messageId,updatedMessage})
    })

   socket.on('delteMessage',async({messageId,room}) => {
    await Message.findByIdAndDelete(messageId);
    io.to(room).emit('messageDeleted',{messageId})
   });
   
  socket.on('disconnect', () => console.log('User Disconnected:', socket.id));
});

const PORT = process.env.PORT || 3001;   
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


