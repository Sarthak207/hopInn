const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

server.on("error", (err) => {
  console.error("Server error:", err);
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});