const io = require('socket.io-client');
const { uuid } = require('uuidv4');

const socket = io(process.env.API_URL || 'http://localhost:3000');

// Generate Unique ID for client
const clientID = process.env.CLIENT_ID || uuid();

socket.emit('client_connected', {
  id: clientID,
  health: {
    storage: 10,
    network: 1
  }
});

// Update client
const intervalID = setInterval(() => {
  socket.emit('client_healthcheck', {
    id: clientID,
    health: {
      storage: Math.ceil(Math.random() * 24),
      network: Math.ceil(Math.random() * 59)
    }
  });
}, 2500);

function exitProgram() {
  clearInterval(intervalID);
  socket.emit('client_disconnected', {
    id: clientID,
  });
  process.exit();
}

process.on('SIGINT', exitProgram);
process.on('exit', exitProgram);
