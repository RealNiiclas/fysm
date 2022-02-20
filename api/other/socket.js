function handleSocket(io, socket) {
  if (!socket.request.session.name) {
    socket.emit("unauthed");
    socket.disconnect();
    return;
  }
  socket.on("messageTo", (message, name) => {
    const receiver = Array.from(io.sockets.sockets.values())
      .find((sock) => sock.request.session.name === name && name !== socket.request.session.name);
    if (!receiver) return socket.emit("message", { failed: true });
    receiver.emit("message", { message, from: socket.request.session.name });
    socket.emit("message", { message, to: receiver.request.session.name });
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
