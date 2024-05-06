#! /usr/bin/env node

const yargs = require('yargs');
const axios = require('axios').default;

// Define the name and the arguments of the command
yargs.command(
    'question', 
    'Get all questions of a specific questionnaire', // Command description for --help  
     );

yargs.positional('questionnaire_id', { describe: 'Identifier of the questionnaire'});
yargs.positional('question_id', { describe: 'Identifier of the question'});      
yargs.positional('format', { describe: 'Define the format of the result (json or csv)'});


//read the arguments
let argv = yargs.argv;
let questionnaire_id = argv.questionnaire_id;
let question_id = argv.question_id;
let format = argv.format;


// if some arguments are missing
if(((process.argv.length - 2)/2) != 3){       // to be checked
    console.log('Some arguments missing. Use --help argument to check the documentation of the command');
  }


// call the required API route in order for the command to do what it is supposed to do
else{
  let url = `http://localhost:5000/getquestiondetails/${question_id}`;
  axios.get(url,{
})
.then((response) => {
    let answers = JSON.stringify(response.data).slice(9,-2);    
    // construct the answer using csv format
    const csvString = [
        [
          "Survey_ID",
          "Question_ID",
          "Question_Title",
          "Required(0:No, 1:Yes)",
          "Question_Type(0:Survey's, 1:Profile)",
          "Answer_ID",
          "Answer_Title",
          "Next_Question_ID"
        ],
        ...(response.data.data).map(item => [
          item.surID,
          item.queID,
          item.queTitle,
          item.required,
          item.qtype,
          item.ansID,
          item.ansTitle,
          item.nextID
        ])
      ]
       .map(e => e.join(",")) 
       .join("\n");

    // give answers in the correct format according to the corresponding argument (format) 
    if(format=='json')console.log(answers);
    if(format=='csv')console.log(csvString);
    // if required format is unknown
    if(format!='json' && format!='csv') console.log('Unknown Format');
    process.exitCode = response.status;
})
.catch(err => {
    process.exitCode = 404;
    console.log(err);
})
}