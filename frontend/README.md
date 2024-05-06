# Frontend  
We have implemented an extensive frontend for our application. The user can perform virtually every action implemented  
from the user interface provided by the frontend. The frontend was implemented using plain Javascript, HTML and CSS.  
Below is a guide, regarding how our frontend is organised and how one can fully explore our application's functionalities  
through it:  

### Step 1: Login  
We have implemented a (not encrypted and not full) login functionality. Each person has an account where it's defined if he is  
a user or an admin. Our login functionality isn't full, and as a result we have only a fixed number of users and admins and specifically  
the following ones:  

| Username  | Password | Role   |      
| ------------- | ------------- | ------------- |
| dimitris@mail.gr  | hello1  |  User             |
| thanos@mail.gr  | hello2  |  Admin              |
| philip@mail.gr  | hello3  |  Admin             |
| yiannis@mail.gr  | hello4  |  User              |  

### Case 1: Login in as a user (User functionalities)  
A person can login as a user as shown in the following example:  

![image](https://user-images.githubusercontent.com/115417360/218682860-04ba4ef4-5515-4717-81c7-a80a64be1633.png)    

If the credentials are correct (in this case they are), the user will be navigated to the following home page, where all questionnaires  
are displayed: 
![image](https://user-images.githubusercontent.com/115417360/218683141-14e89971-babd-41ac-958b-a73d3a89bd24.png)  

#### Home Page: Answer Button  
By choosing the Answer button next to a questionnaire, the user is navigated to the first question of the chosen questionnaire. By answering it  
and clicking 'Next' he will be navigated to the next question, according to the answer he has given. He will then move on to answer the entire questionnaire:  
![image](https://user-images.githubusercontent.com/115417360/218683527-433f28c7-247b-4783-a953-6bbd9e136f54.png)  

Once the user has finished answering the questionnaire, a summary of his given answers will appear on the screen:  
![image](https://user-images.githubusercontent.com/115417360/218683971-e504a208-d695-4434-b3b6-b9ca1da23e52.png)  

By clicking 'Finish' a pop-up message will appear notifying the user that he has finished answering the questionnaire and letting him decide if he wants to  
reanswer it, or be navigated once again to the home page with all the questionnaires:  
![image](https://user-images.githubusercontent.com/115417360/218684322-233f7688-3e6f-407a-b3f4-a43692d89835.png)

#### Home Page: Statistics Button  
By choosing the Statistics Button for a questionnaire, a page with all the questions of that specific questionnaire will appear:  
![image](https://user-images.githubusercontent.com/115417360/218684743-739de43d-aeae-4677-9700-7e03ff301552.png)  

By choosing one specific question, the user will be able to see all answers given in that particular question and a pie chart with the number of answers  
for each option:  
![image](https://user-images.githubusercontent.com/115417360/218685210-ca420024-7492-45aa-b51d-2cb20c25ecc6.png)  
With the 'Back' Button, one can return to the main page.  

#### Home Page: Survey Details Button  
By choosing the Survey Details Button for a questionnaire, a page with all the questions of that questionnaire will be loaded. Their ids, titles, type etc  
will appear:  
![image](https://user-images.githubusercontent.com/115417360/218685817-faf94881-5b1a-4de2-9ad0-6f97e9a9af06.png)  

By picking one particular questionnaire, the user can see all details about the possible answer options of that question:  
![image](https://user-images.githubusercontent.com/115417360/218685912-0bc6db36-b037-481d-917c-9cfa1ed86a25.png)  

With the 'Back' Button, one can navigate back to the home page.   

#### Navigation Bar  
The navigation bar is pretty straightforward. By clicking on the IntelliQ button, one can navigate to the home page from wherever he is in the web page.  
The About button navigates the user to the About page, where general information about the project are contained. By clicking Log Out, one can logout to  
login with a different account. Finally the sun/moon icon can be used to switch from dark to light mode and vice-versa (from wherever you are in the website):  
![image](https://user-images.githubusercontent.com/115417360/218686628-7ae9ff1b-9f9c-442c-909a-32d8099e010c.png)  

### Case 2: Login in as an Admin (Admin functionalities)  

A person can login as an Admin, as shown in the following example:  
![image](https://user-images.githubusercontent.com/115417360/218687149-da346900-7016-40e3-b4ac-9cf785600763.png)  

He will then be navigated to the Admin home page:  
![image](https://user-images.githubusercontent.com/115417360/218687282-79dba110-8684-4871-8abc-bc8d2f2984ca.png)  

#### Create a questionnaire using the 'Create a new Survey' feature:  
An admin an create a questionnaire step-by-step by using the 'Create a new Survey' feature. The admin can fill in a title and a keyword for the survey. He will  
then click 'Create Questionnaire' and he will be navigated to a page where he must create the first question:  
![image](https://user-images.githubusercontent.com/115417360/218688025-2fb27268-6114-41e4-964f-491d5456807f.png)  

By picking the number of answers (in this case 3) and clicking Submit, 3 answer inputs will be created (or more/less according to how many answers the admin specified)  
![image](https://user-images.githubusercontent.com/115417360/218688363-8ada16c9-87f5-4f8e-9248-589eb9f84b31.png)  

By clicking the Next Button, the Admin goes on to create a new question. If he clicks the End Button, he will be navigated to a page where he can  
determine the flow of the questions created:  
![image](https://user-images.githubusercontent.com/115417360/218689224-02743218-c118-49f7-b4e3-6891a429b583.png)

For a specific answer to lead to another question, the admin must fill in next to that answer the question id he wants the answer to lead to (in this case number 105    
in order for answers to lead to Test Question 2). If a particular answer by the user signals the end of the questionnaire, the admin must fill in 0 in that answer's flow  
(as shown next to the answers of Test Question 2).  
By clicking Finish, the questionnaire is saved and the admin is navigated back to the Admin home page.  

#### Create a questionnaire by uploading a JSON file:  
The admin can create a questionnaire by uploading a JSON file. The admin can choose 'Επιλογή αρχείου', choose a JSON file with a questionnaire from his documents  
and upload it by clicking upload. A confirm message will then show up. The questionnaire will then have been uploaded.  

#### Other Admin functionalities:  

##### Show Questionnaires Button  
By clicking this button, a list with all questionnaires is shown. Next to each questionnaire is a Reset button. By clicking that, the admin resets all given  
answers by the users for that specific questionnaire (resetq command in the CLI).  With Back, he can return to the Admin Home page.  

##### System Healthcheck Button  
By clicking this button, the system returns to the user a JSON object. describing the system's current situation (healthcheck command in the CLI).  

##### Reset the system  
Be careful using this button. By clicking on it, all information contained in the database will be deleted and the system will be reset (resetall command in the CLI).  
A JSON object will be returned describing if the resetall command was successful or not.  

##### Navigation Bar  
The Navigation Bar is the same as the user's (Home Page, About page, Switch from dark to light mode and vice-versa).  




















