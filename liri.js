require(`dotenv`).config();
const Twitter = require(`twitter`);
const Spotify = require(`node-spotify-api`);
const request = require(`request`);
const fs = require(`fs`);
const keys = require(`./keys.js`);

// Import Spotify and Twitter packages
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

// Get command
let command = process.argv.slice(2);
let title;

// Parse song or film titles
if (command[0] === `spotify-this-song` ||
    command[0] === `movie-this`) {
    title = command.slice(1).join(` `);
}

command = command[0];

control(command, title);

// Define control function
// Command control structure: Switch Case
function control(command, title) {
    switch (command) {
        case `my-tweets`:
            myTweets();
            break;
        case `spotify-this-song`:
            spotifyThisSong(title);
            break;
        case `movie-this`:
            movieThis(title);
            break;
        case `do-what-it-says`:
            doWhatItSays(`random.txt`);
            break;
    }

}

// Define case functions
function myTweets() {
    let endpoint = `statuses/user_timeline`;
    client.get(endpoint, function (err, tweets, response) {
        if (err) {
            throw err;
        }
        else if (response) {
            tweets.map(currentTweet => {
                return {
                    created_at: currentTweet.created_at,
                    text: currentTweet.text
                }
            })
                .forEach(tweet => console.log(`On ${tweet.created_at} you tweeted: "${tweet.text}"`));
        }
    });
}

function spotifyThisSong(songName) {
    if (songName === "" || !songName) {
        console.log(`No song specified. I'll pick one for you!`);
        songName = "The Sign";
        spotify.request(`https://api.spotify.com/v1/search?q=track%3Athe%20sign%20artist%3Aace%20of%20base&type=track`)
            .then(data => spotifyPrint(data.tracks.items[0], songName))
            .catch(err => { throw err });
    }
    else {
        spotify.search({
            type: `track`,
            query: songName
        }, (err, data) => {
            if (err) {
                throw err;
            }
            if (data) {
                let topResult = data.tracks.items[0];
                spotifyPrint(topResult, songName);
            }
        });
    }
}

function spotifyPrint(trackObj, songName) {
    if (trackObj) {
        console.log(`==== Top Result from Spotify for ${songName} ====`)
        console.log(`Artist: ${trackObj.artists[0].name}`);
        console.log(`Song Name: ${trackObj.name}`);
        console.log(`Album: ${trackObj.album.name}`);
        if (trackObj.preview_url) {
            console.log(`Preview URL: ${trackObj.preview_url}`);
        }
        else {
            console.log(`No preview URL available.`);
        }
    }
    else {
        console.log(`No results for ${songName}...`);
    }
}

function movieThis(movieTitle) {
    if (movieTitle === "" || !movieTitle) { movieTitle = `Mr. Nobody`; }
    request(`http://www.omdbapi.com/?t=${movieTitle}&y=&plot=short&apikey=trilogy`, function (error, response, body) {

        if (error) {
            console.log(`An error occurred... `, error);
        }

        else if (!error && response.statusCode === 200) {
            let result = JSON.parse(body);
            if (result.Response === `False`) {
                console.log(`No results for ${movieTitle}...`);
            }
            else {
                moviePrint(result, movieTitle);
            }
        }

        else {
            console.log(`The request failed...`);
        }
    });
}

function moviePrint(result, movieTitle) {
    console.log(`==== Result from OMDB for ${movieTitle} ====`);
    console.log(`Title: ${result.Title}`);
    console.log(`Year: ${result.Year}`);
    console.log(`IMDB Rating: ${result.Ratings[0] ? result.Ratings[0].Value : `No rating available`}`);
    console.log(`Rotten Tomatoes Score: ${result.Ratings[1] ? result.Ratings[1].Value : `No rating available`}`);
    console.log(`Country of Origin: ${result.Country}`);
    console.log(`Language: ${result.Language}`);
    console.log(`Actors: ${result.Actors}`);
    console.log(`Plot: ${result.Plot}`);
}

function doWhatItSays(fileName) {
    fs.readFile(fileName, "utf8", function (err, data) {

        if (err) {
            throw err;
        }

        let terms = data.split(",");
        let title;

        // Parse song or film titles
        if (terms[0] === `spotify-this-song` ||
            terms[0] === `movie-this`) {
            title = terms.slice(1).join(` `);
        }

        terms = terms[0];

        control(terms, title);

    });

}