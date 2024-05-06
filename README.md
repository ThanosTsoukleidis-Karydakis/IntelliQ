# Software Engineering Project 2022-2023 (IntelliQ)
   
This is our semester project for the Software Engineering course of National Technical University of Athens. Its goal  
was to create a functional application that enables the user to answer 'smart questionnaires', meaning questionnaires  
where each answer given by the user leads to a different question. This project is called IntelliQ.    

##  Features   
Our application offers the user an extensive UI (frontend) where he/she can choose a questionnaire, answer it and also  
check details about a specific questionnaire. We have also developed an interactive user interface for the admin of the  
system, where he/she can create new questionnaires (or upload them directly in a JSON format), and perform other    
administrative actions (healthcheck, reset the system, reset answers of a specific questionnaire etc -more details in the  
README file of the frontend). We have also developed a CLI tool, that the administrator can use to perform all of these    
actions, using CLI commands. Our project provides documentation done with Visual Paradigm and Postman and both the API and     
the CLI have been tested.     

## Installation  
- #### Step 1: Database:  
A necessary program one needs, to install our application, is XAMPP Control Panel. MySQL Workbench is also needed. To start, enable  
the Apache and MySQL modules from XAMPP (click the start buttons next to these modules). Afterwards, copy the intelliQ.sql script, which is  
contained in the 'data' folder to MySQL Workbench and run the script. If you want to add some dummy data, follow the instructions located in the  
README.md file in the data folder, regarding how to produce them. After that, run the script with these dummy data in the same MySQL Connection as  
the previous sql file. After these steps, the database will have been successfully created.  

- #### Step 2: Install the necessary packages:  
Firstly, download Node.js/Express.js (following the instructions in their website).   
While being in the main folder of the project (SoftEng22-17), run the following commands to create a Node.js project and install the necessary packages:    
`npm init -y`   
`npm install @jsdevtools/chai-exec chai chai-http cors csv csv-stringify dotenv express fs json2csv mocha mysql nodemon save-dev`  

While being in the cli folder of the project (SoftEng22-17/cli), run the following commands:  
`npm init -y`  
`npm install @jsdevtools/chai-exec axios yargs`  

All the above mentioned packages can also be found in the respective package.json files.  

- #### Step 3: Run the application:  

To start the server, use the following command while being in the api-backend folder (SoftEng22-17/api-backend):  
`node app`       or      `nodemon app`  (if nodemon has been configured correctly)  

### Use the CLI:  
To use the CLI of the application, run the CLI commands (explained in the cli folder README.md) while being in the cli folder  
(SoftEng22-17/cli).  

### Use the frontend:  
To use the frontend of the application, go to the login.html file, found in the frontend folder (to start from the main page of our website),  
right click anywhere and choose Open with Live Server.  

### And have fun :money_mouth_face:

##  Programming Languages/Frameworks used   
| Part of the project  | Language/Framework |
| ------------- | ------------- |
| Backend/API  | JavaScript(node.js/express.js)  |
| Frontend  | HTML, CSS, Javascript  |   
| Database  | MySQL  |  
| CLI  | JavaScript (node.js)  |    
| Testing  | JavaScript (node.js)  |  
| Documentation  | Visual Paradigm, Postman  |

The more specific dependencies/packages used will be specified in the README files of each particular folder of the project.      
For our collaboration regarding both the code and project management we used GitHub.  

##  Our Team   Group: softeng2022-17  
| Name  | NTUA register number (Αριθμός Μητρώου) |
| ------------- | ------------- |
|  [Athanasios Tsoukleidis-Karydakis](https://github.com/ThanosTsoukleidis-Karydakis) | el19009  |
|  [Dimitrios-David Gerokonstantis](https://github.com/DimitrisDavidGerokonstantis)  | el19209  |   
|  [Filippos Sevastakis](https://github.com/FilipposSevastakis)  |  el19183 |  
|  [Ioannis Karavgoustis](https://github.com/GiannisKaravgoustis)  |  el19847 |    
  


