////////////////SSE server sent event
const express = require('express');
const app = express();
const port = 3000;

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (data) => {
        res.write(`data: ${data}\n\n`);
    };

    const intervalId = setInterval(() => {
        sendEvent(new Date().toLocaleTimeString());
    }, 1000);

    req.on('close', () => {
        clearInterval(intervalId);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




<!DOCTYPE html >
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSE Example</title>
</head>
<body>
    <div id="time"></div>
    <script>
        const eventSource = new EventSource('/events');

        eventSource.onmessage = (event) => {
    document.getElementById('time').innerText = `Server Time: ${event.data}`;
    };

        eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    };
</script>
</body>
</html>







///////////////////////////////

