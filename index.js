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
    name: "query",
    message: "Enter a search term to use:"
  }
]

inquirer.prompt(questions, function( answers ) {
  var client = new PlexAPI(answers.server);

  client.query("/search?query=" + answers.query).then(function (results) {
    var filteredResults = results._children.filter(function (result) {
      if (result._elementType === 'Video') {
        return result;
      }
    });

    if (filteredResults.length > 0) {
      console.log('\nResults:\n');
      filteredResults.forEach(function (result) {
        console.log(result.title);
      })
    } else {
      console.log("\n No results found\n");
    }

  }, function (err) {
    throw new Error("Could not connect to server");
  });
});
