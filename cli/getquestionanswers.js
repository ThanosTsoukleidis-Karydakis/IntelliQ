#! /usr/bin/env node

const yargs = require('yargs');
const axios = require('axios').default;


// Define the name and the arguments of the command
yargs.command(
    'getquestionanswers', 
    'Get all given answers in a specific question of a specific questionnaire', // Command description for --help  
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
if(((process.argv.length - 2)/2) != 3){
  console.log('Some arguments missing. Use --help argument to check the documentation of the command');
}

// call the required API route in order for the command to do what it is supposed to do
else{    
  let url = `http://localhost:5000/getquestionanswers/${questionnaire_id}/${question_id}`;
  axios.get(url,{
  })
  .then((response) => {
      let answers = JSON.stringify(response.data).slice(9,-2);
      // construct the answer using csv format
      const csvString = [
          [
            "Questionnaire Title",
            "Session ID",
            "Question Title",
            "Answer Title",
            "Time",
          ],
          ...(response.data.data).map(item => [
            item.Survey,
            item.Session,
            item.Question,
            item.AnswerTitle,
            item.Time
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
      console.log(err);
  })
}