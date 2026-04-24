// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 1864 });

// Broadcast to all clients
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', (ws, req) => {
  console.log('Client connected');
  const ip = req.socket.remoteAddress;
  // Send welcome message
  ws.send('Welcome! You are connected to the WebSocket server.');
  const names = new Map();
  const buzzedIn = [];
  // Listen for messages from clients
  ws.on('message', (message) => {
    console.log(ip)
    console.log("names",names);
    if (names.get(ip)==null)
    {
      const text = message.toString();
      console.log(`Received: ${text}`);
      names.set(ip, text);
      console.log(names);
    // Broadcast the received message to all clients
       wss.broadcast(`${text} has joined`);
    }
    else
    {
      console.log("arr", buzzedIn);
      if (!buzzedIn.includes(names.get(ip)))
      {
        console.log("Buzzing in");
        const text = message.toString();
        wss.broadcast(`${text} has buzzed in`)
        buzzedIn.push(names.get(ip))
        console.log("buzzed in")
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:1864');