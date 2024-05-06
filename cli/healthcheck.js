#! /usr/bin/env node

const yargs = require('yargs');
const axios = require('axios').default;

// Define the name and the arguments of the command
yargs.command(
  'healthcheck', 
  'This command returns the current status of the server (whether it is running or not plus database info)', // Command description for --help  
   );

yargs.positional('format', { describe: 'Define the format of the result (json or csv)'}); 

let argv = yargs.argv;
//read the argument
let format = argv.format;

yargs.positional('format', { describe: 'Define the format of the result (json or csv)'});  


// if argument is missing
if(((process.argv.length - 2)/2) != 1){
  console.log('Some arguments missing. Use --help argument to check the documentation of the command');
}

// call the required API route in order for the command to do what it is supposed to do
else{
  let url = `http://localhost:5000/admin/healthcheck`;
  axios.get(url,{
  })
  .then((response) => {
      let answers = JSON.stringify(response.data.data).slice(1,-1);
      // construct the answer using csv format
      const csvString = [
          [
            "status",
            "Server",
            "sqlport",
            "Database",
            "User_Id",
            "password"
          ],
          ...(response.data.data).map(item => [
            item.status,
            item.Server,
            item.sqlport,
            item.Database1,
            item.User_Id,
            item.password
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
    process.exitCode = 400;
    console.log(err);
  })

}