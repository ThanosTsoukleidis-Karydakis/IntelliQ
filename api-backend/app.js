//const express = require('express');
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

//create new questionnaire
app.post('/insert', (request, response) => {
    const { title, keyword } = request.body;
    var len;
    if(title == ' ') {len = true; response.status(400).send('Bad request');}
    else{
        len = false;
        const db = dbService.getDbServiceInstance();
        const result = db.insertNewQuestionnaire(title, keyword);
        result
        .then(data => status(data, len))
        .catch(err => console.log(err));
    }

    //A function to handle potential errors while creating a new survey (here : empty title given)
    function status(data, len){
         if(len==true)response.status(400).send('Bad request');
         else response.status(200).json({data : data});
     }
});

//show all questionnaires
app.get('/getAllQuestionnaires', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllSurveys();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

//create new question
app.post('/addQuestion', (request, response) => {
    const { title, answers_array, times, checkbox, qtype, category} = request.body;
    var len;
    if(title == ' ') len = true;
    else len = false;
    const db = dbService.getDbServiceInstance();
    const result = db.insertNewQuestion(title, answers_array, times, checkbox, qtype, category);
    
    result
    .then(data => status(data, len))
    .catch(err => console.log(err));

    //A function to deal with potential errors (here : empty question title given)
    function status(data, len){
         if(len==true)response.status(400).send('Bad request');
         else response.status(200).json({data : data});
     }
});


//show survey's summary
app.get('/getSurveysSummary', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getSurveysSummary();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

//Choose the flow of the questions and update the DB accordingly
app.patch('/updateFlow', (request, response) => {
    const { flow_array, help_array, flow_counter } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateFlow(flow_array, help_array, flow_counter);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});


//Bring the first question of the questionnaire a user has chosen to answer
app.get('/answer_survey/:sesID/:surID', (request, response) => {
    const survID  = request.params.surID;
    const sessID  = request.params.sesID;
    const db = dbService.getDbServiceInstance();
    const result = db.getRequestedSurvey(survID,sessID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));
    
    //A function that deals with potential errors that can occur (Here: the questionnaire we are asking for doesn't exist)
    function status(data){
        if(data.length==0)response.status(404).send('Not Found');
        else response.status(200).json({data : data});
    }
    
});

//create a new session for a given questionnaire that the user chose to answer
app.post('/create_session/:value', (request, response) => {
    const surveyID  = request.params.value;
    const db = dbService.getDbServiceInstance();
    const result = db.createNewSession(surveyID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));
    
    //A function that deals with potential errors (Here: Invalid session_id or questionnaire_id)
    function status(data){
        if(data.length==0)response.status(400).send('Bad Request');
        else response.status(200).json({data : data});
    }
});

//Bring the next question given a certain chosen answer by the user in a given session
app.get('/next_question/:option/:sessionID', (request, response) => {
    const opt  = request.params.option;
    const sessionID  = request.params.sessionID
    const db = dbService.getDbServiceInstance();
    const result = db.getNextQuestion(opt,sessionID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));
    
    //A function that deals with potential errors (here: The requested question doesn't exist)
    function status(data){
        if(data.length==0)response.status(404).send('Not Found');
        else response.status(200).json({data : data});
    }
});


//save new value
app.post('/save_value', (request, response) => {
    const { button_value} = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.Save_new_value(button_value);
    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

app.post('/doanswer/:questionnaireID/:questionID/:session/:optionID', (request, response) => {
    const sessionID  = request.params.session;
    const optionID  = request.params.optionID;
    const db = dbService.getDbServiceInstance();
    const result = db.SaveGivenAnswer(sessionID,optionID);
    result
    .then(data => status(data))
    .catch(err => console.log(err));
    
    //A function that deals with the potential errors (Here: Invalid given data)
    function status(data){
        if(data.length==0)response.status(400).send('Bad Request');
        else response.status(200).json({data : data});
    }

});

//Login giving email and password
app.get('/login/:email/:pass', (request, response) => {
    const email  = request.params.email;
    const password  = request.params.pass;
    const db = dbService.getDbServiceInstance();
    const result = db.checkCredentials(email,password);

    result
    .then(data => status(data))
    .catch(err => console.log(err));
    
    //A function dealing with potential errors (Here: Account not found-wrong credentials)
    function status(data){
        if(data.length==0)response.status(404).json({data : data});
        else response.status(200).json({data : data});
    }
    
});

//Get a summary of the answers given in a specific questionnaire in a specific session
app.get('/getsessionanswers/:questionnaireID/:session', (request, response) => {
    const sessionID  = request.params.session;
    const questionnaireID  = request.params.questionnaireID;
    const db = dbService.getDbServiceInstance();
    const result = db.getSummary(sessionID, questionnaireID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));
    
    //A function that deals with potential errors (Requested data not found)
    function status(data){
        if(data.length==0)response.status(404).send('Not Found');
        else response.status(200).json({data : data});
    }
});

//Get all answers given for a specific questionnaire (preliminary step: find the questionnaire and its questions)
app.get('/getquestionanswers/:questionnaireID', (request, response) => {
    const questionnaireID  = request.params.questionnaireID;
    const db = dbService.getDbServiceInstance();
    const result = db.getSurveysQuestions(questionnaireID);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
    
});

//Get all answers given for a specific questionnaire
app.get('/getquestionanswers/:questionnaireID/:questionID', (request, response) => {
    const questionID  = request.params.questionID;
    const db = dbService.getDbServiceInstance();
    const result = db.getStatistics(questionID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));
    
    //A function that deals with the errors (in this case: data not found)
    function status(data){
        if(data.length==0)(response.status(404).json({data : data}));
        else response.status(200).json({data : data});
    }
});

//healthcheck for the system
app.get('/admin/healthcheck', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getHealthcheck();
    
    result
    .then(data => response.status(200).json({data : data}))
    .catch(err => {
        response.status(400);   //potential error
    });
});

const Fs = require('fs/promises')
app.post('/admin/questionnaire_upd', (request, response) => {
     const {surID, surTitle,keywords,questions}  = request.body;
     console.log('app js',surID,surTitle,keywords,questions[0].options.length);
     const db = dbService.getDbServiceInstance();
     const result = db.newSurveyJson(surID, surTitle,keywords,questions);
     result
     .then(data => response.json({ data: data}))
     .catch(err => console.log(err));
 });

//reset all parameters of the system
app.post('/admin/resetall', (request, response) => {
    const { button_value} = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.resetAll();
    result
    .then(data => response.status(200).json({ data: data}))
    .catch(err => {
        response.status(400);
    });
});


app.post('/admin/questionnaire_upd', (request, response) => {
    const {surID, surTitle,keywords,questions}  = request.body;
    console.log('input',surID,surTitle,keywords,questions[0].options); 

    const db = dbService.getDbServiceInstance();
    const result = db.newSurveyJson(surID, surTitle,keywords,questions);

    result
    .then(data => status(data))
    .catch(err => console.log(err));
     
 
     function status(data){
         if(data.length==0)response.status(400).send('Bad Request');
         else response.status(200).json({data : data});
     }

 });

//Return all questions of a particular questionnaire
app.get('/getsurveydetails/:questionnaireID', (request, response) => {
    const questionnaireID  = request.params.questionnaireID;
    const db = dbService.getDbServiceInstance();
    const result = db.getSurveyDetails(questionnaireID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));

    //A function that deals with errors (here: Requested questionnaire not found)
    function status(data){
         if(data.length==0)response.status(404).send('Not Found');
         else response.status(200).json({data : data});
     }
});

//Get the answers of a question of a particular questionnaire
app.get('/getquestiondetails/:questionID', (request, response) => {
    const questionID  = request.params.questionID;
    const db = dbService.getDbServiceInstance();
    const result = db.getQuestionDetails(questionID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));

    //A function that deals with the error (Here: Question not found)
    function status(data){
        if(data.length==0)response.status(404).send('Not Found');
        else response.status(200).json({data : data});
    }
}); 

//Create a new user
app.post('/admin/createUser', (request, response) => {
  const {username,password,id} = request.body;
     const db = dbService.getDbServiceInstance();
     const result = db.createUser(username, password,id);
     result
     .then(data => response.json({ data: data}))
     .catch(err => console.log(err));
 });

 //reset all parameters of a questionnaire
app.post('/admin/resetq/:questionnaireID', (request, response) => {
    const surveyID = request.params.questionnaireID;
    const db = dbService.getDbServiceInstance();
    const result = db.resetQuestionnaire(surveyID);
    result
    .then(data => response.status(200).json({ data: data}))
    .catch(err => {
        response.status(400);   //in case of an error
    });
});


//doanswer from cli
app.post('/cli/doanswer/:questionnaireID/:questionID/:session/:optionID', (request, response) => {
     const sessionID  = request.params.session;
     //console.log('session',sessionID);
     const optionID  = request.params.optionID;
     //console.log('option',optionID);
     const surveyID  = request.params.questionnaireID;
    // console.log('questionnaire',surveyID);

     const db = dbService.getDbServiceInstance();
     const result1 = db.checkIfSessionExists(sessionID);
     let session=[];
     result1
     .then(data => session=data);

    console.log(session);
    let ses_result;
    if(session.length==0) {ses_result = db.CLIcreateNewSession(surveyID,sessionID);}
    var result;
     result = db.CliSaveGivenAnswer(surveyID,sessionID,optionID);
     result
     .then(data => status(data))
     .catch(err => console.log(err));
    
     function status(data){
         if(data.length==0)response.status(400).send('Bad Request');
         else response.status(200).json({data : data});
     }
 });


let server = app.listen(5000, () => console.log('app is running'));
module.exports = server;
