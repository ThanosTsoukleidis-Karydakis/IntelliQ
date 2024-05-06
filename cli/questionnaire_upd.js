#! /usr/bin/env node

const yargs = require('yargs');
const axios = require('axios').default;

// Define the name and the arguments of the command
yargs.command(
    'questionnaire_upd', // Command name, plus a positional argument message
    'Upload a json file with a new questionnaire with id=100', // Command description for --help  
     );

 yargs.positional('source', { describe: 'name of the json source file'});    

//read the argument
let argv = yargs.argv;
let source = argv.source;


// read the input json file 
const fs = require("fs");
fs.readFile(source, "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    process.exitCode=400; // of error occurs
    return;
  }
  // call the required API route in order for the command to do what it is supposed to do
  try {
    let url = `http://localhost:5000/admin/questionnaire_upd`;
    const customer = JSON.parse(jsonString);
    axios.post(url, {
    surID : customer.questionnaireID, 
    surTitle : customer.questionnaireTitle,
    keywords :customer.keywords,
    questions :customer.questions
})
 .then((response)=> {
      console.log('Survey Added'); // if everything is alright
      process.exitCode=response.status; 
  })
  .catch((error)=> { // if an error occurs
      console.log('Error on adding the new questionnaire. This questionnaire may have already been added or the server does not work properly');
  })
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});