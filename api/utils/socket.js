function handleSocket(socket) {
  socket.on("message", (message) => socketApp.sockets.emit("message", { message, from: socket.request.session.name }));
  if (!socket.request.session.name) {
    socket.emit("unauthed");
    socket.disconnect();
  }
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
