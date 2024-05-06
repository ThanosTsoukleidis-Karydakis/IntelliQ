# API-Backend  
In this particular folder, the code necessary for the API and the backend of our application is contained.  
The implementation of the API/backend was done using node.js. Two files are contained here:  

| File  | Usage |
| ------------- | ------------- |
| app.js  | Contains all endpoints of our application  |
| dbService.js  | Contains the functions that the endpoints call to access the database and perform queries. The connection with the DB is also done here  |  

Our API contains all endpoints contained in the requirements of the project. We have also implemented additional endpoints that are used by the frontend  
and the CLI to perform more actions or facilitate others. 

## Packages  

The packages needed for this part of our project are the following ones:  

- cors  
- dotenv  
- express  
- fs  
- mysql  
- nodemon  

## Some of our endpoints  
The basic (required) endpoints of our application are the following ones:  
- /admin/healthcheck
- /admin/questionnaire_upd
- /admin/resetall
- /admin/resetq/:questionnaireID
- /questionnaire/:questionnaireID
- /question/:questionnaireID/:questionID
- /doanswer/:questionnaireID/:questionID/:session/:optionID
- /getsessionanswers/:questionnaireID/:session
- /getquestionanswers/:questionnaireID/:questionID  

Since we have implemented frontend for the creation of questionnaires by the admin as well, many endpoints that  
have to do with this have also been added and can be found in the app.js file. 

This folder also contains a file that contains a link to the Postman API Documentation of our application. 
