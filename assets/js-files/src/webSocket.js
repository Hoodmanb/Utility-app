/*console.log('socket');
document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profileForm')
    const greet = document.getElementById('greet');
    let socket;

    function connectWebSocket() {
        socket = new WebSocket('wss://utility-app-gamma.vercel.app', 'websocket');
        //socket = new WebSocket('ws://localhost:5050');

        socket.onopen = function() {
            console.log('WebSocket connection established.');
        };

        const list = [
            'displayName',
            'names',
            'gender',
            'phone',
            'email',
            'profileImage'
        ];

        socket.onmessage = function(event) {
            const message = JSON.parse(event.data);
            console.log('Received message from server:', message);
            greet.textContent = message.displayName ? message.displayName: 'Hello';

            // Define the list of properties to display
            if (Object.keys(message).length > 0) {
                for (let j = 0; j < list.length; j++) {
                    let propertyName = list[j];
                    let messagesDiv = document.getElementById(`socket-${propertyName}`);

                    if (propertyName === 'email') {
                        if (messagesDiv && message.email) {
                            const lastTenCharacters = message.email.slice(-10);
                            messagesDiv.textContent = lastTenCharacters;
                        }
                    } else if (propertyName === 'profileImage') {
                        if (messagesDiv && message.photoURL) {
                            messagesDiv.src = message.photoURL;
                            console.log(message.photoURL);
                        }
                    } else {
                        if (messagesDiv && message[propertyName]) {
                            messagesDiv.textContent = message[propertyName];
                        } else {
                            console.warn(`Element with ID 'socket-${propertyName}' not found.`);
                        }
                    }
                }
            } else {
                // Clear all fields if message is empty
                for (let n = 0; n < list.length; n++) {
                    let messagesDiv = document.getElementById(`socket-${list[n]}`);
                    if (messagesDiv) {
                        messagesDiv.textContent = ''; // Clear text content
                        messagesDiv.src = ''; // Clear image source if applicable
                    }
                }
            }
        };

        socket.onerror = function(error) {
            console.error('WebSocket error:', error);
        };

        socket.onclose = function() {
            console.log('WebSocket connection closed. Reconnecting...');

            setTimeout(connectWebSocket, 2000); // Attempt to reconnect after 2 seconds
        };
    }

    connectWebSocket(); // Initial connection

    profileForm.addEventListener('submit', function(e) {
        e.preventDefault()
        setTimeout(function() {
            connectWebSocket()
        }, 2000);
    })
});*/

/*document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('update').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Create a new HTMX request
        htmx.ajax('GET', '/api/dynamic-data', {
            target: '#socket-names', // Target element to update
            swap: 'innerHTML', // Swap method
        });
    });

    // Listen for the htmx:afterOnLoad event to get the response data
    document.body.addEventListener('htmx:afterOnLoad', function(event) {
        if (event.detail.path === '/api/dynamic-data') {
            const responseData = event.detail.xhr.responseText;
            console.log('Received data:', responseData);
            // You can manipulate the response data here if needed
        }
    });
})*/