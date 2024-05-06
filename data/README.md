# Data  
In this folder, everything that has to do with the implementation of our database is contained.  
The implementation of our database is done using MySQL. The files contained here are the following:  

- IntelliQ.sql :  A file that contains all tables of our database. In order to create the database, one  
needs to run this script using MySQL Workbench.  
- dummy_data.py : A Python file used to create dummy data for our database. Running this file, the user  
can specify how many questionnaires he/she wants to create, how many questions each will contain, how  
many answers each question will have and how many dummy sessions with random given answers will be created.   
A file will then be automatically created that contains all INSERT queries  
that need to be run so as to create the dummy data the user requested. The user will then run this script using  
MySQL Workbench and all dummy data will have been created.  
- Some JSON files : These JSON files contain some full questionnaires (with question and answers that actually make sense :slightly_smiling_face: ).  
These JSON files can be passed to the database using the respective CLI command (questionnaire_upd) or by using the frontend as  
an admin. Some more JSON files with questionnaires can be found in the cli folder. 

The following Python packages are needed for the dummy_data.py file to be able to run:  
- random_word  
- essential_generators  
- random  
- string   
- sys   
