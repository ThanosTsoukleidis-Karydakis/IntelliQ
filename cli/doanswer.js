#! /usr/bin/env node

const yargs = require('yargs');
const axios = require('axios').default;

// Define the name and the arguments of the command
yargs.command(
    'doanswer', 
    'Post the answerID of a specific question of a questionnaire in a given session', // Command description for --help  
    );

yargs.positional('questionnaire_id', { describe: 'Identifier of the questionnaire'});
yargs.positional('question_id', { describe: 'Identifier of the question'}); 
yargs.positional('session_id', { describe: 'Identifier of the session'});      
yargs.positional('option_id', { describe: 'Identifier of the answer'}); 

//read the arguments
let argv = yargs.argv;
let questionnaire_id = argv.questionnaire_id;
let question_id = argv.question_id;
let session_id = argv.session_id;
let option_id = argv.option_id;

// if some arguments are missing
if(((process.argv.length - 2)/2) != 4){       
    console.log('Some arguments missing. Use --help argument to check the documentation of the command'); 
}

// call the required API route in order for the command to do what it is supposed to do
else{
    let url = `http://localhost:5000/cli/doanswer/${questionnaire_id}/${question_id}/${session_id}/${option_id}`;
    axios.post(url, {
})
    .then((response) => { // if everything is alright
        process.exitCode = response.status;
        console.log('Answer Added')})
    
    .catch((error)=> {  // if an error occurs
        process.exitCode = 400;
        console.log('Error on adding the new answer: Tried to add an already existing sessionID or the server does not work properly');
    })
}