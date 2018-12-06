require('dotenv').config()

var keys = require('./keys.js')
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var inquirer = require('inquirer');

// taking user request
inquirer.prompt([{
    type: "list",
    name: "task",
    message: "Hellow there, please chose the option I can help you with:",
    choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"]
}]).then( (res) => {
    // declare functions for each task
    concert = () => {
        // gather the search input from the user
        inquirer.prompt([{
            message : "artist/band name?",
            name: "concertInput"
        }]).then( (res) => {
            // call the API to do the search
            console.log(res.concertInput)
        })
    }
    song = () => {
         // gather the search input from the user
         inquirer.prompt([{
             message: "song name?",
             name: "songInput"
         }]).then( (res) => {
             // call the API to do the search
             console.log(res.songInput)
         })  
    }
    movie = () => {
         // gather the search input from the user
         inquirer.prompt([{
            message: "movie name?",
            name: "movieInput"
        }]).then( (res) => {
            // call the API to do the search
            console.log(res.movieInput)
        })  
    }
    whatEves = () => {
          // gather the search input from the random text file
          // call the API to do the search
            console.log("WhatEves") 
    }
    // pick the function per user's request 
    switch(res.task){
        case "concert-this" :
        concert()
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
