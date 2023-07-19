import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const [socket, setSocket] = useState();
  const handleSubmit = () => {
    setMessages((prevMessage) => [...prevMessage, message]);
    socket.emit("send-message", message, room);
    setMessage("");
  };
  const handleRoom = (e) => {
    setRoom(e.target.value);
  };
  const handleJoinRoom = () => {
    socket.emit("join-room", room, (message) => {
      setMessages((prevMsg) => [...prevMsg, message]);
    });
  };
  useEffect(() => {
    const socket = io("https://chat-server-sepia.vercel.app/");
    setSocket(socket);
    socket.on("connect", () => {
      setMessages((prevMessage) => [
        ...prevMessage,
        `you are connected wit id ${socket.id}`,
      ]);
    });
    socket.on("receive-message", (message) => {
      setMessages((prevMessage) => [...prevMessage, message]);
    });
  }, []);

  return (
    <div className="container">
      <div className="message-container">
        {messages.map((item, id) => {
          return <p key={id}>{item}</p>;
        })}
      </div>

      <div className="bottom-div-container">
        <div className="inner-div-container">
          <input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => handleChange(e)}
          />
          <button onClick={() => handleSubmit()}>Send</button>
        </div>
        <br />
        <div className="inner-div-container">
          <input
            type="text"
            placeholder="Enter your Room Name"
            value={room}
            onChange={(e) => handleRoom(e)}
          />
          <button onClick={() => handleJoinRoom()}>Join</button>
        </div>
      </div>
    </div>
  );
}

export default App;
