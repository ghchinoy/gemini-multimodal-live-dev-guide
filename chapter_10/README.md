# Chapter 10: Proxy Server


We introduce a backend proxy server in order secure API keys 


What we did
```
mkdir gemini-ws-proxy
cd gemini-ws-proxy
npm init -y
```


Add an .env.development file (can copy the .env file included)

```
# Gemini API Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# OpenWeather API Key
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

to try it out

```
npm install
npm run start:dev
```