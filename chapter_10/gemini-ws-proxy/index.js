require('dotenv').config(); // Load environment variables from .env
const WebSocket = require('ws');

// Configuration
const apiKey = process.env.GEMINI_API_KEY;
const host = 'generativelanguage.googleapis.com';
const endpoint = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
const proxyPort = 8080; // Port the proxy server will listen on
//const targetPort = 80; // Replace with the actual target WebSocket server port
//const targetPath = '/';
console.log(`proxying for ${endpoint}`)

// Create the proxy WebSocket server
const wss = new WebSocket.Server({ port: proxyPort });

wss.on('connection', (clientSocket, request) => {
    console.log('Client connected');

    // Construct the target WebSocket URL
    const targetUrl = endpoint;

    // Create a connection to the target server
    const serverSocket = new WebSocket(targetUrl);

    let messageQueue = []; // Queue for messages before serverSocket is open

    serverSocket.on('open', () => {
        console.log('Target server connection open');

        // Process any queued messages
        while (messageQueue.length > 0) {
            const message = messageQueue.shift();
            console.log('Sending queued message to target server');
            serverSocket.send(message);
        }

        clientSocket.on('message', (message) => {
            console.log(`Received message from client: ${message}`);

            if (serverSocket.readyState === WebSocket.OPEN) {
                try {
                    const parsedMessage = JSON.parse(message);

                    // Check for 'setup' as a top-level key
                    if ('setup' in parsedMessage) {
                        console.log("Sending message as setup message to target server.");

                        // Handle setup message
                        serverSocket.send(message);
                    } else {
                        // Normal message forwarding
                        console.log("Regular message, forwarding to target server.");
                        serverSocket.send(message);
                    }
                } catch (err) {
                    console.error("Failed to parse message:", err);
                    // Send an error message to the client if needed
                }
            } else {
                console.log('Server socket not open, queuing message');
                messageQueue.push(message);
            }
        });
    });

    // Handle messages from the target server
    serverSocket.on('message', (message) => {
        console.log(`Received message from server: ${message}`);

        const wsResponse = JSON.parse(message)

        if (wsResponse.setupComplete) {
            console.log('Setup complete.');
            clientSocket.send(message);
        } else if (wsResponse.toolCall) {
            console.log('Received tool call:', wsResponse.toolCall);

            // check the toolCall.functionCalls[] for the name of the function to execute
            const functionCalls = wsResponse.toolCall.functionCalls;
            const functionResponses = [];

            for (const call of functionCalls) {
                if (call.name === 'get_weather') {
                    console.log('Executing weather function call for:', call.args.city);

                    // then execute that request
                    let mockWeatherResponse = {
                        temperature: 212,
                        description: "cloudy with a chance of meatballs",
                        humidity: 105,
                        windSpeed: -5,
                        city: "Gemini-istan",
                        country: "GB"
                    }
                    console.log('Weather response:', mockWeatherResponse);

                    functionResponses.push({
                        id: call.id,
                        name: call.name,
                        response: {
                            result: {
                                object_value: mockWeatherResponse
                            }
                        }
                    });

                    // send the info back to the client so it can decide to show the result or not
                    clientSocket.send(JSON.stringify({
                        tool_response: {
                            function_responses: functionResponses
                        }
                    }));

                    // then return the response to the server so it can continue
                    if (functionResponses.length > 0) {
                        const toolResponse = {
                            tool_response: {
                                function_responses: functionResponses
                            }
                        };
                        console.log('Sending tool response:', toolResponse);
                        serverSocket.send(JSON.stringify(toolResponse));
                    }
                }
            }
        } else {
            // Forward the message to the client
            clientSocket.send(message);
        }

    });

    // Handle errors on the client socket
    clientSocket.on('error', (err) => {
        console.error(`Client socket error: ${err}`);
    });

    // Handle errors on the server socket
    serverSocket.on('error', (err) => {
        console.error(`Server socket error: ${err}`);
    });

    // Handle client socket close
    clientSocket.on('close', () => {
        console.log('Client disconnected');
        // Close the connection to the target server
        serverSocket.close();
    });

    // Handle server socket close
    serverSocket.on('close', () => {
        console.log('Server connection closed');
        // Close the client connection if it's still open
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.close();
        }
    });
});

console.log(`WebSocket proxy server listening on ws://localhost:${proxyPort}`);