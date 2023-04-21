let name = null;
// let roomNo = null;
let socket = io();

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
  document.getElementById("chat-interface");
  console.log("chat-interface");

  // called when a message is received
  socket.on("chat message", function (message) {
    writeOnHistory("<b>" + message);
  });
}

/**
 * called when the Send button is pressed.
 */
function sendChatText() {
  let input = document.getElementById("chat-input");
  socket.emit("chat message", input.value);
  input.value = "";

  // get msg text
  let chat_input = document.getElementById("chat-input").value;
  if (chat_input) {
    console.log(chat_input);

    // emit the msg to server
    socket.emit("chat", chat_input);

    // reset input value
    chat_input = "";
  }
}

/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnHistory(text) {
  let history = document.getElementById("chat-history");
  let paragraph = document.createElement("p");

  paragraph.innerHTML = text;
  history.appendChild(paragraph); // add a new 'p' to a new history
  document.getElementById("chat-input").value = ""; // grab the input chat
}
