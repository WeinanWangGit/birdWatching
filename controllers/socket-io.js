//add socket.io
var clients = 0;
const sighting_controller = require("../controllers/sighting");

exports.init = function (io) {
  io.sockets.on("connection", function (socket) {
    try {

      /**
       * create or joins a room
       */
      socket.on("create or join", function (room, userId) {
        console.log("user" + userId + "join in the room" + room);
        clients++;
        socket.join(room);
        io.sockets.in(room).emit("joined", room, userId);
      });

      /**
       * send chat messages
       */
      socket.on("chat message", function (room, userId, chatText) {
        io.sockets.in(room).emit("chat message", room, userId, chatText);
        var text = userId + "  " + chatText;
        // Obtain observation records of the corresponding room.
        sighting_controller.getSightingById(room).then(function (sighting) {
          sighting_controller.updateSighting(sighting, text);
        });
        console.log("chat message", room, userId, chatText);
      });

      /**
       * disconnect
       */
      socket.on("disconnect", () => {
        console.log("user disconnected");
        clients--;
        socket.emit("broadcast", {
          description: clients + " clients connected!",
        });
      });
    } catch (e) {}
  });
};
