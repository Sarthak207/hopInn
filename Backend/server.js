// server.js
const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');

const port = process.env.PORT || 5000; // Make sure .env PORT is set

const server = http.createServer(app); // create HTTP server with Express app

initializeSocket(server); // Attach socket.io to that HTTP server

// Error handling
server.on("error", (err) => {
  console.error("Server error:", err);
});

// Start server
server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
