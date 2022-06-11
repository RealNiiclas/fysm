const { getFriends } = require("../database/friendTable");
const { getMembers } = require("../database/memberTable");
const { createGroupMessage } = require("../database/gmTable");
const { containsSwearWords, containsFakeNews } = require("../filtering/filter");
const { createMessage } = require("../database/pmTable");
const config = require("../../config.json");

function handleSocket(io, socket) {
  if (!socket.request.session.name) {
    socket.emit("unauthed");
    socket.disconnect();
    return;
  }
  socket.on("messageTo", async (message, user) => {
    if ((config.filterSwearWords && containsSwearWords(message)) || (config.filterFakeNews && (await containsFakeNews(message))))
      return socket.emit("message", { failed: true, denied: true });
    const receiver = Array.from(io.sockets.sockets.values()).find((sock) => sock.request.session.name == user && user !== socket.request.session.name);
    if (!message || !getFriends(socket.request.session.name).find((friend) => friend.name == user && friend.accepted) ||
      createMessage(socket.request.session.name, user, message) < 1)
      socket.emit("message", { failed: true });
    else {
      if (receiver) receiver.emit("message", { message, from: socket.request.session.name });
      socket.emit("message", { message, to: user });
    }
  });
  socket.on("messageToGroup", async (message, grouping) => {
    if ((config.filterSwearWords && containsSwearWords(message)) || (config.filterFakeNews && (await containsFakeNews(message))))
      return socket.emit("message", { failed: true, denied: true });
    const members = getMembers(grouping);
    if (!message || !members.find((member) => (member.user == socket.request.session.name && member.accepted == 1)) ||
      createGroupMessage(socket.request.session.name, grouping, message) < 1)
      return socket.emit("groupMessage", { failed: true });
    Array.from(io.sockets.sockets.values()).forEach((sock) => {
      if (members.find((member) => (member.user == sock.request.session.name && member.accepted == 1)))
        sock.emit("groupMessage", { message, from: socket.request.session.name, id: grouping });
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
