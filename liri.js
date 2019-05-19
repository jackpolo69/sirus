// These are my npm packages
require("dotenv").config()
var keys = require("./keys")
var Spotify = require("node-spotify-api")
var axios = require("axios")
var fs = require("fs")

// Global variables
var command = process.argv[2]
var whatToSearch = ""

// This is the starting point of my app
handleCommand(handleSearch());

// Functions
function handleCommand(whatToSearch) {
    if (command === "spotify-this-song") {
        spotifySong(whatToSearch);
    }
    else if (command === "movie-this") {
        movieThis(whatToSearch);
    }
    else if (command === "concert-this") {
        concertThis(whatToSearch);
    }
    else if (command === "do-what-it-says") {
        readAndApply();
    }
}

function handleSearch() {
    for (var i = 3; i < process.argv.length; i++) {
        whatToSearch += process.argv[i];
    }
    console.log("whatToSearch; " + whatToSearch);
    return whatToSearch
}

function spotifySong(songName) {
    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var tracks = data.tracks.items
        for (var i = 0; i < tracks.length; i++) {
            console.log("songName: " + tracks[i].name);
            console.log("songLink: " + tracks[i].external_urls.spotify);
            console.log("albumName: " + tracks[i].album.name);
            console.log("-----------------------------------------------------------------------------")
        }
    });
}

function movieThis(movieName) {
    axios.get('http://www.omdbapi.com/?apikey=' + keys.omdb.key + '&t=' + movieName)
        .then(function (response) {
            console.log("Title " + response.data.Title);
            console.log("Year " + response.data.Year);
            console.log("IMDB Rating " + response.data.Ratings[0].Value);
            console.log("Rotton Tomatos " + response.data.Ratings[1].Value);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function concertThis(concertName) {
    axios.get("https://rest.bandsintown.com/artists/" + concertName + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log("venueName " + response.data[0].venue.name);
            console.log("location " + response.data[0].venue.city);
            console.log("date " + response.data[0].datetime);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function readAndApply() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        var dataArray = data.split(",")
        command = dataArray[0];
        handleCommand(dataArray[1]);
    })
}