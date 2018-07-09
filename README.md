# LIRI-Bot
LIRI-Bot (Language Interpretation and Recognition Interface) is a SIRI-like CLI that parses typed commands and performs a set of tasks based on the commands given at runtime. Written in Node.js.

For the application to work, after running npm install, you must create a .env file. This file should look like this:

```js
# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

# Twitter API keys

TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

```

Where your-* should be replaced with your actual keys for both the Spotify and Twitter APIs; the application will not work without this file or those keys filled in properly.