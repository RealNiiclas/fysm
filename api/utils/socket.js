function handleSocket(io, socket) {
  socket.on("message", (message) => io.sockets.emit("message", { message, from: socket.request.session.name }));
  socket.on("messageTo", (message, name) => {
    const receiver = Array.from(io.sockets.sockets.values())
      .find((sock) => sock.request.session.name === name);
    if (!receiver) return;
    
    receiver.emit("message", { message, from: `Von ${socket.request.session.name}` });
    socket.emit("message", { message, from: `An ${receiver.request.session.name}` })
  });
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
