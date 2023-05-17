// disable buttons when offline
function disableButtons() {
  // disable all buttons on the page except for the button in the header and close button
  const buttons = document.querySelectorAll(
    "button:not(.header-button):not(.close-button)"
  );
  buttons.forEach((button) => (button.disabled = true));
}

function enableButtons() {
  // enable all buttons on the page
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = false));
}


