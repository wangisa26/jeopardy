// src/components/NotificationCenter.js
import React, { useState, useEffect } from 'react';

const NotificationCenter = () => {
  const [messages, setMessages] = useState([]);
  const [inputtputt, setInputtputt] = useState('');
  const [ws, setWs] = useState(null);
  const [username, setUsername]=useState('');
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:1864');
    setWs(websocket);
    websocket.onopen = () => console.log('Connected to WebSocket server');
    websocket.onmessage = (event) => {
      console.log(event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
    websocket.onclose = () => console.log('Disconnected from WebSocket server');

    // Cleanup on unmount
    return () => websocket.close();
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN && username == '') {
      console.log("input: " + inputtputt);
      setUsername(inputtputt);
      ws.send(inputtputt);
      console.log("Username:" + username + " " + "input:" + inputtputt);
      setInputtputt('');
      console.log(username, "input:",inputtputt);
    }
    else 
    {
      console.log(username);
      ws.send(username);
    }
  };

  return (
    <div className="notification-center">
      <h2>Real-Time Notifications</h2>
      <div className="messages"> 
        {messages.map((message, index) => (
          <p key={index}>{message.toString()}</p>
        ))}
      </div>
      {username=='' &&
      < div>
      <input
        type="text"
        value={inputtputt}
        onChange={(e) => setInputtputt(e.target.value)}
        placeholder="Enter Username"
      />
      <button onClick={sendMessage}>Join</button>
      </div>}
      {username &&
      <div>
      {console.log("showing buzzer")}
      <button onClick={sendMessage}>Buzz In</button>
      </div>}
    </div>
  );
};

export default NotificationCenter;