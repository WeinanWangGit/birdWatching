let name = null;
let roomNo = null;
let socket = io();

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init(sightingJson) {
  const sighting = JSON.parse(sightingJson);
  const username = sessionStorage.getItem("username");
  name = username;
  roomNo = sighting._id;
  connectToRoom(name, roomNo);

  // called when a message is received
  socket.on("chat message", function (roomNo, name, chatText) {
    var message = name + ": " + chatText;
    writeOnHistory("<b>" + message);
  });
}

// To avoid uncaught syntax error for JSON.stringify
function sanitiseText(text) {
  return text.replace(/['"]/g, "").trim();
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
  let input = sanitiseText(document.getElementById("chat_input").value);
  socket.emit("chat message", roomNo, name, input);
  input.value = "";
}

/**
 * used to connect to a room. It gets
 * - the user name and room number from the interface using document.getElementById('').value
 * - uses socket.emit('create or join') to join the room
 */
function connectToRoom(name, roomNo) {
  console.log(name + " join the " + roomNo);
  socket.emit("create or join", roomNo, name);
}

/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnHistory(text) {
  let history = document.getElementById("chat_history");
  let paragraph = document.createElement("p");

  paragraph.innerHTML = text;
  history.appendChild(paragraph); // add a new 'p' to a new history
  document.getElementById("chat_input").value = ""; // grab the input chat
}
