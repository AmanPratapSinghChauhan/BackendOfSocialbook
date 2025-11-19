import { connect } from 'mongoose';
import app from  './app.js';
import { connectDB } from './Config/database.js';
import cloudinary from 'cloudinary';

connectDB();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
})



const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

import { Server  } from 'socket.io';

const io= new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
    // credentials: true,
  },
});
let onlineUsers = {};

io.on("connection", (socket) => {

  socket.on("setup", (userId) => {
    onlineUsers[userId] = socket.id;
    // socket.join(userId);
    socket.emit("connected"); 
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });


  socket.on("friendRequest",(friendId,userId)=>{
    const recipientSocketId = onlineUsers[friendId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("friendRequestRecieved", { userId });
    }
  })

socket.on("typing", (room) => {
  const toSocketId = onlineUsers[room];
  console.log("typing", room);
  if(toSocketId){
    io.to(toSocketId).emit("typing");
  }
});
  socket.on("stop typing", (room) => 
    {
      console.log("stop typing", room);
      const toSocketId = onlineUsers[room];
      if(toSocketId){
        io.to(toSocketId).emit("stop typing");
      }
    }
);

   socket.on("new message", (newMessageRecieved, room) => {
    const toSocketId = onlineUsers[room];
    console.log("new message recieved", room);
    if(toSocketId){
      var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id)  return;
      io.to(toSocketId).emit("message recieved", newMessageRecieved);
    });

    }
    
  });


   socket.on('disconnect', () => {
    // Remove disconnected socket
    for (const [userId, sockId] of Object.entries(onlineUsers)) {
      if (sockId === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});




