"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Container, Button, Typography, TextField, Stack } from "@mui/material";

export default function Home() {
  const socket = useMemo(() => io("http://localhost:5000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");

  const [messages, setMessages] = useState<string[]>([]);

  const handlerSubmit = (e: any) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e: any) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log("Received message:", data);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("message", (message) => {
      console.log("Message from server:", message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    // <Container maxWidth="sm">
    //   <Typography variant="h4" component="div" gutterBottom>
    //     Welcome to the Chat App
    //   </Typography>
    //   <Typography variant="h4" component="div" gutterBottom>
    //     {socket.id ? `Your ID: ${socket.id}` : "Connecting..."}
    //   </Typography>

    //   <form onSubmit={joinRoomHandler}>
    //     <h5>Join Room</h5>
    //     <TextField
    //       id="outlined-basic"
    //       label="Room Name"
    //       variant="outlined"
    //       value={roomName}
    //       onChange={(e) => setRoomName(e.target.value)}
    //       fullWidth
    //     />
    //     <Button type="submit" variant="contained" color="primary">
    //       Join
    //     </Button>
    //   </form>

    //   <form onSubmit={handlerSubmit}>
    //     <TextField
    //       id="outlined-basic"
    //       label="Type your message"
    //       variant="outlined"
    //       value={message}
    //       onChange={(e) => setMessage(e.target.value)}
    //       fullWidth
    //     />
    //     <TextField
    //       id="outlined-basic"
    //       label="Room"
    //       variant="outlined"
    //       value={room}
    //       onChange={(e) => setRoom(e.target.value)}
    //       fullWidth
    //     />
    //     <Button type="submit" variant="contained" color="primary">
    //       Send
    //     </Button>
    //   </form>
    //   <Stack>
    //     {messages.map((msg, index) => (
    //       <Typography key={index} variant="body1" component="div" gutterBottom>
    //         {msg}
    //       </Typography>
    //     ))}
    //   </Stack>
    // </Container>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl border rounded shadow-lg p-4">
        {/* Header */}
        <div className="border-b p-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome to the Chat App
          </h1>
          <p className="text-sm text-gray-600">
            {socket.id ? `Your ID: ${socket.id}` : "Connecting..."}
          </p>
        </div>
        {/* chatbox */}
        <div className="h-[500px] border-b overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2 text-gray-800">
              {msg}
            </div>
          ))}
        </div>
        {/* Inputs */}
        <div className="p-4 space-y-2">
          {/* Message Input */}
          <form
            onSubmit={handlerSubmit}
            className="flex flex-col sm:flex-row sm:items-center gap-2"
          >
            <label className="text-sm font-medium w-full sm:w-auto">
              Message:
            </label>
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <label className="text-sm font-medium w-full sm:w-auto">DM:</label>
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Peer Id"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Send
            </button>
          </form>

          {/* Room Input */}
          <form
            onSubmit={joinRoomHandler}
            className="flex flex-col sm:flex-row sm:items-center gap-2"
          >
            <label className="text-sm font-medium w-full sm:w-auto">
              Room:
            </label>
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Join
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
