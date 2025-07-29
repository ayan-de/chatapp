import { createServer } from "http";
import { Server } from "socket.io";
import express from 'express';
import cors from 'cors';


const app = express();
app.use(cors())

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Adjust this to your client URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

//middleware for later use
io.use((socket, next) => {next();});

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);  

  socket.on("message", ({room, message})=> {
    console.log( message, room);
    io.to(room).emit("receive-message", message);
    });

    socket.on("join-room", (roomName) => {
    console.log(`User ${socket.id} joined room: ${roomName}`);
    socket.join(roomName);  
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

httpServer.listen(5001,()=>{
    console.log('server running at http://localhost:5001');
});
