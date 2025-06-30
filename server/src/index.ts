import { createServer } from "http";
import { Server } from "socket.io";
import express from 'express';


const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  // options
});

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);
});

httpServer.listen(5000,()=>{
    console.log('server running at http://localhost:5000');
});