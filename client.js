const socket = io('ws://localhost:3500');
const messagelist = document.getElementById('message-list');
document.querySelector('form').addEventListener('submit', sendMessage);
document.getElementById('room-button').addEventListener('click', enterRoom);
document.getElementById('leave-button').addEventListener('click', leaveRoom);
var room = 'robby';
document.getElementById('room-input').value = room;

function sendMessage(e) {
  e.preventDefault();
  const input = document.getElementById('message-input');
  if (input.value) {
      socket.emit('message', input.value)
      input.value = ""
  }
  input.focus()
}

function enterRoom(e) {
    e.preventDefault();
        
    room = document.getElementById('room-input').value;
    console.log(`new_room would be ${room}`);
    if (room !== "")
        socket.emit("enter-room", room);
    else
        alert("you have to type room name for entering");
}

function leaveRoom(e) {
    e.preventDefault();

    room = "robby";
    socket.emit("enter-room", room);
    document.getElementById('room-input').value = room;
}

function addMessage(m) {
    const li = document.createElement('li')
    li.textContent = m;
    messagelist.appendChild(li)
}

//receiving message
socket.on("message", (data) => {
    addMessage(data);
})

socket.on("delete-messages", () => {
    messagelist.innerHTML = '';
})