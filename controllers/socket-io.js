var clients = 0;

exports.init = function (io) {
  io.sockets.on("connection", function (socket) {
    console.log("A user connected");
    clients++;

    try {
      // Handle incoming chat messages
      socket.on("chat message", function (message) {
        console.log("Received message:", message);
        io.sockets.emit("chat message", message); // Broadcast the message to all connected clients
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log("user disconnected");
        clients--;
        io.emit("message", "A user has left the chat");
      });
    } catch (e) {}
  });
};
