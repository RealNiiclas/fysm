function handleSocket(io, socket) {
  if (!socket.request.session.name) {
    socket.emit("unauthed");
    socket.disconnect();
    return;
  }

  socket.on("message", (message) => 
    io.sockets.emit("message", { message, from: socket.request.session.name }));
  
  socket.on("messageTo", (message, name) => {
    const receiver = Array.from(io.sockets.sockets.values())
      .find((sock) => sock.request.session.name === name);
    if (!receiver) return;
    
    receiver.emit("message", { message, from: socket.request.session.name, direct: true });
    socket.emit("message", { message, to: receiver.request.session.name, direct: true })
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
