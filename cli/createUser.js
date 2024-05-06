#! /usr/bin/env node

const yargs = require('yargs');
const axios = require('axios').default;

// Define the name and the arguments of the command
yargs.command(
    'createUser', 
    'Create a new User', // Command description for --help  
    );

yargs.positional('id', { describe: 'id to be created'});
yargs.positional('username', { describe: 'Username to be created'});
yargs.positional('password', { describe: 'Password to be created'}); 


//read the arguments
let argv = yargs.argv;
let id = argv.id;
let username = argv.username;
let password = argv.password;

// if some arguments are missing
if(((process.argv.length - 2)/2) != 3){       
    console.log('Some arguments missing. Use --help argument to check the documentation of the command'); 
}

// call the required API route in order for the command to do what it is supposed to do
else{
    let url = `http://localhost:5000/admin/createUser`;
    axios.post(url, {
        username:username,
        password:password,
        id:id
})
    .then((response) => { // if everything is alright
        process.exitCode = response.status;
        console.log('User Added')})
    
    .catch((error)=> {  // if an error occurs
        console.log('Error on adding the new user');
    })
}