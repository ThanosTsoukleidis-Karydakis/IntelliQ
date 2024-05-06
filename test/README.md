# API testing
In this particular folder, we implement testing for our API (functional/unit testing).  

In order to run the tests, run the following command, while being in the folder of our project:   
`npm test`  
In order for the tests to succeed, you need to have the questionnaire contained in the file user-test.json (and found in the cli file)  
submitted to the database (using questionnaire_upd from either the cli or the frontend).   

The tests performed, have to do with two big use cases:  
- User use case: The user logs in, a new session is created for questionnaire number 60, the user answers the first question,  
the next question is brought according to the flow, it is also answered and the answers summary is created.   
- Admin use case: The admin logs in, creates a new questionnaire, adds three questions, sees the summary of the survey that he  
created and defines the flow of the questions.   

Attention! For the test cases to work, the user-test.json file (id = 60) is needed. Before running the tests, add this questionnaire if it's not  
already in the database by the following CLI command (while being in the cli folder):  
`questionnaire_upd --source user-test.json`  

The following packages are needed for the testing (the implementation is done with node.js):  
- chai  
- chai-http  
- mocha
