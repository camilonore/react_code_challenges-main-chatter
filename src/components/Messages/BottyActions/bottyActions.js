export function userMessage (message) {
  const message = message
  
  socket.on('user-message', (message) => {
    playSend()
  });
}