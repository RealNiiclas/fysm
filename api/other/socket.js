const { getFriends } = require("../database/friendsTable");
const { createMessage } = require("../database/messagesTable");
const { getMembers } = require("../database/membersTable");

function handleSocket(io, socket) {
  if (!socket.request.session.name) {
    socket.emit("unauthed");
    socket.disconnect();
    return;
  }
  socket.on("messageTo", (message, name) => {
    const receiver = Array.from(io.sockets.sockets.values())
      .find((sock) => sock.request.session.name === name && name !== socket.request.session.name);
    if (!receiver || !getFriends(socket.request.session.name).find((friend) => friend.name === receiver.request.session.name && friend.accepted) ||
      createMessage(socket.request.session.name, receiver.request.session.name, message) < 1)
      return socket.emit("message", { failed: true });
    receiver.emit("message", { message, from: socket.request.session.name });
    socket.emit("message", { message, to: receiver.request.session.name });
  });
  socket.on("messageToGroup", (message, groupname) => {
    const members = getMembers(groupname);
    if (!members.find((member) => (member.username === socket.request.session.name && member.accepted === 1)))
      return socket.emit("groupMessage", { failed: true });
    Array.from(io.sockets.sockets.values()).forEach((sock) => {
      if (members.find((member) => (member.username === sock.request.session.name && member.accepted === 1)))
        sock.emit("groupMessage", { message, from: socket.request.session.name });
    });
  });
}

function disconnectSocket(io, id) {
  io.sockets.sockets.forEach(socket => {
    if (socket.request.session.id !== id) return;
    socket.emit("unauthed");
    socket.disconnect();
  });
}

module.exports = {
  disconnectSocket,
  handleSocket
};
