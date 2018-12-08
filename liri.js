require('dotenv').config()

var keys = require('./keys.js')
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var inquirer = require('inquirer');
var axios = require('axios');
var moment = require('moment');
var fs = require('fs')

// taking user request
inquirer.prompt([{
    type: "list",
    name: "task",
    message: "Hello there, please chose the option I can help you with:",
    choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"]
}]).then((res) => {
    var consertInfo = []
    // declare functions for each task
    concert = (liriChoice) => {
        if (liriChoice) {
            gatherConsert(liriChoice)
        } // gather the search input from the user if it is not liri's choice
        else {
            inquirer.prompt([{
                message: "artist/band name?",
                name: "concertInput"
            }]).then((res) => {
                gatherConsert(res.concertInput)
            })
        }
        // call the API to do the search
        function gatherConsert(search) {
            axios.get(`https://rest.bandsintown.com/artists/${search}/events?app_id=codingbootcamp`).then(
                (conRes) => {
                    //show all upcomming events
                    if (conRes.data.length > 0) {
                        for (var i = 0; i < conRes.data.length; i++) {
                            var info = {
                                name: conRes.data[i].venue.name,
                                city: conRes.data[i].venue.city,
                                region: conRes.data[i].venue.region,
                                date: conRes.data[i].datetime
                            }
                            //convert the date to our target format
                            var convertedDate = moment(info.date, "YYYY-MM-DD HH:mm:ss")
                            var formatedDate = convertedDate.format("MM/DD/YYYY")
                            consertInfo.push(`${info.city},${info.region} at ${info.name} ${formatedDate}`);
                        }
                        console.log(`Upcoming events for ${search}:`)
                        for (var j = 0; j < consertInfo.length; j++) {
                            console.log(consertInfo[j])
                        }
                    } // inform user that there is no upcomming events
                    else {
                        console.log(`There is no upcoming events for ${search}.`)
                    }
                }).catch((err) => {
                    if (err.code == undefined) {
                        console.log("this is not a valid Input. See you next time!")
                    }
                })
        }
    }
    song = (liriChoice) => {
        // gather the search input from the user if it is not liri's choice
        if (liriChoice) {
            gatherSong(liriChoice);
        } else {
            inquirer.prompt([{
                message: "song name?",
                name: "songInput"
            }]).then((res) => {
                gatherSong(res.songInput);
            })
        }
        function gatherSong(search) {
            spotify.search({ type: 'track', query: search }, (err, data) => {
                if (err) {
                    console.log('Error occurred: ' + err);
                    return;  //from spotify npm docs
                }
                else {
                    try {
                        var songInfo = data.tracks.items[0];
                        console.log(`Artist Name: ${songInfo.artists[0].name}`)
                        console.log(`Song Name: ${songInfo.name}`)
                        console.log(`Album Name: ${songInfo.album.name}`)
                        console.log(`Preview Link: ${songInfo.preview_url}`)
                    } catch (err){
                        spotify.search({ type: 'track', query: "Ace of Base" }, (err, data) => {
                            if (err) {
                                console.log('Error occurred: ' + err);
                                return;  //from spotify npm docs
                            }
                            else {
                                var songInfo = data.tracks.items[0];
                                console.log(`Artist Name: ${songInfo.artists[0].name}`)
                                console.log(`Song Name: ${songInfo.name}`)
                                console.log(`Album Name: ${songInfo.album.name}`)
                                console.log(`Preview Link: ${songInfo.preview_url}`)
                            }
                        })
                    };
                }
            });
        }

    }
    movie = (liriChoice) => {
        if (liriChoice) {
            gatherMovie(liriChoice)
        } // gather the search input from the user if it is not liri's choice
        else {
            inquirer.prompt([{
                message: "movie name?",
                name: "movieInput"
            }]).then((res) => {
                gatherMovie(res.movieInput)
            })
        }

        // call the API to do the search
        function gatherMovie(search) {
            axios.get(`http://www.omdbapi.com/?t=${search}&apikey=${keys.OMDB}`).then(
                (movieRes) => {
                    // Gather the movie information if they exist and print them
                    if (movieRes.data.Title !== undefined) {
                        console.log(`Here is the information for ${movieRes.data.Title}`);
                        console.log(`Title of the movie: ${movieRes.data.Title}`);
                        console.log(`Year the movie came out: ${movieRes.data.Year}`);
                        console.log(`IMDB Rating of the movie: ${movieRes.data.imdbRating}`);
                        try {
                            console.log(`Rotten Tomatoes Rating of the movie: ${movieRes.data.Ratings[1].Value}`)
                        } catch (error) {
                            console.log("Rotten Tomatoes Rating has not been found")
                        }
                        console.log(`Country where the movie was produced: ${movieRes.data.Country}`);
                        console.log(`Language of the movie: ${movieRes.data.Language}`);
                        console.log(`Plot of the movie: ${movieRes.data.Plot}`);
                        console.log(`Actors in the movie: ${movieRes.data.Actors}`);
                    } else {
                        console.log("The movie title has not been found.")
                    }
                }).catch((err) => {
                    console.log(err)
                })
        }
    }
    whatEves = () => {
        // read the content of the text file
        fs.readFile(`${__dirname}/random.txt`, 'utf8', (err, data) => {
            if (err) {
                console.log(`Can not read the file random.txt. Error: ${err}`)
            }
            options = data.split(",")
            // randomly chose an option 
            RandomIndex = Math.floor(Math.random() * 3)
            switch (RandomIndex) {
                case 0:
                    song(options[1])
                    break;
                case 1:
                    movie(options[3]);
                    break;
                case 2:
                    concert(options[5]);
                    break;
            }
        })
        // call the API to do the search
    }
    // pick the function per user's request 
    switch (res.task) {
        case "concert-this":
            concert();
            break;
        case "spotify-this-song":
            song();
            break;
        case "movie-this":
            movie();
            break;
        case "do-what-it-says":
            whatEves();
            break;
    }

})
