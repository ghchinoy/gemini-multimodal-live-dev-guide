# Chapter 10: Proxy Server


We introduce a backend proxy server in order secure API keys 


## Try it out

To try it out, start the proxy via one terminal and the webserver in another.

### Gemini Live Proxy

Change into the `gemini-ws-proxy` directory

```
cd gemini-ws-proxy
```

Add an .env.development file (can copy the `.env.environment` file included to `.env`), the contents should look like:

```
# Gemini API Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# OpenWeather API Key
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

Install the server and run it.

```
npm install
npm run start:dev
```

This will start a gemini multimodal live proxy server on port 8080.

### Web app

In the this directory, in another terminal, start a webserver.

The index.html's javscript has been modified to:

* point to the proxy server ws://localhost:8080 as the websocket server (see line 40)
* handles the tool responses to change the function panel


## Deploy to Cloud Run

For the proxy service:

```
cd gemini-ws-proxy
gcloud run deploy gemini-ws-proxy --source . --allow-unauthenticated
```

For the front end webapp:

* Substitute in the Cloud Run deploy service endpoint from the deployment step on line 40. Note that the endpoint should be `wss://` since Cloud Run will provide a SSL secured service.

```
gcloud run deploy gemini-multimodal-live --source . --allow-unauthenticated

# or, if you want to use the Cloud Run preview with IAP protection
# gcloud alpha run deploy gemini-multimodal-live --source . --iap

```





# What we did

* Created a Gemini Multimodal Live WebSocket proxy service.

    ```
    mkdir gemini-ws-proxy
    cd gemini-ws-proxy
    npm init -y
    ```

* Added a favicon to the webapp

* Modified the webapp to handle tool_responses to update the metadata panel