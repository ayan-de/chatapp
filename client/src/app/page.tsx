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
    <Container maxWidth="sm">
      <Typography variant="h4" component="div" gutterBottom>
        Welcome to the Chat App
      </Typography>
      <Typography variant="h4" component="div" gutterBottom>
        {socket.id ? `Your ID: ${socket.id}` : "Connecting..."}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>

      <form onSubmit={handlerSubmit}>
        <TextField
          id="outlined-basic"
          label="Type your message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
        />
        <TextField
          id="outlined-basic"
          label="Room"
          variant="outlined"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <Stack>
        {messages.map((msg, index) => (
          <Typography key={index} variant="body1" component="div" gutterBottom>
            {msg}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
}
