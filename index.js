#!/usr/bin/env node

var inquirer = require("inquirer");
var PlexAPI = require("plex-api");

var questions = [
  {
    type: "input",
    name: "server",
    message: "What is your Plex Server address:",
    validate: function (value) {
      var pass = value.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/);
      if (pass) {
        return true;
      } else {
        return "Please enter a valid IPv4 address";
      }
    }
  },
  {
    type: "input",
    name: "username",
    message: "If you are using Plex Home please enter your username"
  },
  {
    type: "password",
    name: "password",
    message: "If you are using Plex Home please enter your password"
  },
  {
    type: "input",
    name: "query",
    message: "Enter a search term to use:"
  }
]

inquirer.prompt(questions, function( answers ) {
  var options = {};
  options.hostname = answers.server;
  options.username = answers.username;
  options.password = answers.password;

  var client = new PlexAPI(options);

  client.query("/search?query=" + answers.query).then(function (results) {
    var filteredResults = results._children.filter(function (result) {
      if ((result.type === 'movie') || (result.type === 'show')) {
        return result;
      }
    });

    if (filteredResults.length > 0) {
      console.log('\nResults:\n');
      filteredResults.forEach(function (result) {
        console.log(result.type + ': ' + result.title);
      })
    } else {
      console.log("\n No results found\n");
    }

  }, function (err) {
    console.error("Could not connect to server:");
    console.error(err);
  });
});
