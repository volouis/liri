let dotenv = require("dotenv").config();

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
        getTweets();
    
    }else if(what === "spotify-this-song"){
        var songName = inputOrNot(info, 2)
        lookSong(songName);
    
    }else if(what === "movie-this"){
        var movieName = inputOrNot(info, 3);
        movieInfo(movieName);
    
    }else if(what === "do-what-it-says"){
        doFile();
    }
}

function getTweets(){
    client.get('statuses/user_timeline', function(error, tweets, response) {
        if(error) throw error;

        if(20 < tweets.length){
            var limit = 20;
        }else{
            var limit = tweets.length;
        }

        for(var i = 0; i < limit; i++){
            console.log(tweets[i].text);
            console.log(tweets[i].created_at);
            outputFile(tweets[i], 0)
        }

      });
}

function inputOrNot(info , num){
    var movieName = "";
    var word = process.argv.length;
    if(process.argv[3]){
        for(var i = 3; i < word; i++){
            movieName += "+" + process.argv[i];
        }
    }else if(info){
        movieName = info;
    }else{
        if(num === 2){
            movieName = "The Sign"
        }else{
            movieName = "Mr.Nobody"
        }
    }
    return movieName;
}

function lookSong(song){
    spotify.search({ type: "track", query: song, limit: 1}, function(err, data) {
        if(err){
            return console.log("ERROR OCCIRRED: " + err);
        }

        for(var i = 0; i < data.tracks.items[0].artists.length; i++){
            console.log("Artist(s): " + data.tracks.items[0].artists[i].name);
        }
        console.log("Song's name: " + data.tracks.items[0].name);
        console.log("Link: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
        outputFile(data, 1);
    })
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
        outputFile(movie, 2);
    });
}

function doFile(){
    fs.readFile("random.txt", "utf8", (err, data) => {
        if(err) throw err;
        var task = data.split(",")
        whatToDo(task[0], task[1]);
    })
}

function outputFile(info, num){
    if(num === 0){
        fs.appendFile("log.txt", "\ntweet: " + info.created_at, "utf8", (err) => {
            if(err) throw err; 
        });
        fs.appendFile("log.txt", "\ntime: " + info.text, "utf8", (err) => {
            if(err) throw err; 
        });

    }else if(num === 1){
        for(var i = 0; i < info.tracks.items[0].artists.length; i++){
            fs.appendFile("log.txt", "\nArtist(s): " + info.tracks.items[0].artists[i].name, "utf8", (err) => {
                if(err) throw err; 
            });
        }

        fs.appendFile("log.txt", "\nSong's name: " + info.tracks.items[0].name , "utf8", (err) => {
            if(err) throw err; 
        });
        fs.appendFile("log.txt", "\nLink: " + info.tracks.items[0].external_urls.spotify , "utf8", (err) => {
            if(err) throw err; 
        });
        fs.appendFile("log.txt", "\nAlbum: " + info.tracks.items[0].album.name, "utf8", (err) => {
            if(err) throw err; 
        });

    }else if(num === 2){
        fs.appendFile("log.txt", "\nTitle: " + info.Title , "utf8", (err) => {
            if(err) throw err; 
        });
        fs.appendFile("log.txt", "\nYear: " + info.Year , "utf8", (err) => {
            if(err) throw err; 
        });
        fs.appendFile("log.txt", "\nIMDB Rating: " + info.imdbRating , "utf8", (err) => {
            if(err) throw err; 
        });
        fs.appendFile("log.txt", "\nRotten Tomatoes Rating: " + info.Ratings[1].Value , "utf8", (err) => {
            if(err) throw err; 
        });
        fs.appendFile("log.txt", "\nCountry Origin: " + info.Country , "utf8", (err) => {
            if(err) throw err; 
        });
        fs.appendFile("log.txt", "\nLanguage: " + info.Language , "utf8", (err) => {
            if(err) throw err; 
        });
        fs.appendFile("log.txt", "\nPlot: " + info.Plot , "utf8", (err) => {
            if(err) throw err; 
        });
        fs.appendFile("log.txt", "\nActors: " + info.Actors , "utf8", (err) => {
            if(err) throw err; 
        });
    }
    fs.appendFile("log.txt", "\n", (err) => {
        if(err) throw err; 
    });
}