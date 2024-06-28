const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 9090 });

wss.on('connection', function connection(ws) {
    console.log('Client connected.');

    // Send a message to the client immediately upon connection
    ws.send('Hello Client!');

        ws.send(message);
        
    // Handle client closing connection
    ws.on('close', function() {
        console.log('Client disconnected.');
        clearInterval(interval); // Stop sending messages when client disconnects
    });
});