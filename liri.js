require("dotenv").config();

let keys = require("./keys.js");
var request = require("request");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var doWhat = process.argv[2];
whatToDo(doWhat);

function whatToDo(what, info){
    if(what === "my-tweet"){
    
    }else if(what === "spotify-this-song"){
        lookSong(info);
    
    }else if(what === "movie-this"){
        inputOrNot(info);
    
    }else if(what === "do-what-it-says"){
        doFile();
    }
}

function lookSong(song){
    spotify.search({ type: "track", query: "Motorsport", limit: 1}, function(err, data) {
        if(err){
            return console.log("ERROR OCCIRRED: " + err);
        }

        for(var i = 0; i < data.tracks.items[0].artists.length; i++){
            console.log("Artist(s): " + data.tracks.items[0].artists[i].name);
        }
        console.log("Song's name: " + data.tracks.items[0].name);
        console.log("Link: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
    })
}

function inputOrNot(info){
    var movieName = "";
        var word = process.argv.length;
        if(process.argv[3]){
            for(var i = 3; i < word; i++){
                movieName += "+" + process.argv[i];
            }
        }else if(info){
            movieName = info;
        }else{
            movieName = "Mr.Nobody"
        }
        movieInfo(movieName);
}

function movieInfo(movieName){
    queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";;
    request(queryUrl, function(err, res, body) {
        if(err) throw err;
        var movie = JSON.parse(body);

        console.log("Title: " + movie.Title);
        console.log("Year: " + movie.Year);
        console.log("IMDB Rating: " + movie.imdbRating);
        console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
        console.log("Country Origin: " + movie.Country);
        console.log("Language: " + movie.Language);
        console.log("Plot: " + movie.Plot);
        console.log("Actors: " + movie.Actors);
    });
}

function doFile(){
    fs.readFile("random.txt", "utf8", (err, data) => {
        if(err) throw err;
        var task = data.split(",")
        whatToDo(task[0], task[1]);
    })
}