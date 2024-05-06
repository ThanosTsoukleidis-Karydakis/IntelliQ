const mysql = require('mysql');
const dotenv = require('dotenv');
const { json, response } = require('express');
let instance = null;
dotenv.config();

//connect to intelliq database
const connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'IntelliQ',
   port: 3306

   //otherwise, use environment variables :

   /*host: process.env.HOST,
   user: process.env.USER,
   password: process.env.PASSWORD,
   database: process.env.DATABASE,
   port: process.env.DB_PORT*/
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    //check database status
     console.log('db ' + connection.state);
});


// Database Class with all DB functions 
class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    /* route : /getAllQuestionnaires | use : get all the questionnaires that have been created */
    async getAllSurveys() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "select distinct(sur.id), sur.title, sur.keywords from survey as sur inner join questions as que on sur.id=que.survey_id ;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    /* route : /insert | use : insert a new questionnaire, with the given title and keyword */
    async insertNewQuestionnaire(title, keyword) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO survey (title, keywords) VALUES (?, ?);";

                connection.query(query, [title, keyword] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return {
                id : insertId,
                title : title,
                keyword : keyword
            };
        } catch (error) {
            console.log(error);
        }
    }


    /* route : /addQuestion | use : insert a new question in the last questionnaire */
    async insertNewQuestion(title, answers_array, times, checkbox, qtype, category) {
        try {
            //take the last questionnaire
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id FROM survey ORDER BY id DESC LIMIT 0, 1;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            const resp = await new Promise((resolve, reject) => {
                const query = "SELECT id FROM category where title = ?;";

                connection.query(query, [category], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            //insert the question
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO questions(title, required, category_id, qtype, survey_id) VALUES (?,?, ?, ?, ?);";

                connection.query(query, [title,checkbox, resp[0].id, qtype, response[0].id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            }); 

            // insert all possible answers for the added question (contained into answers_array)
            var insertId2_array = [];
            var insertId2;
            for(var i = 0; i < times; i++) {
                    insertId2 = await new Promise((resolve, reject) => {
                    var query2 = "INSERT INTO answers(title, whose_question_id) VALUES (?, ?);";
                    connection.query(query2, [answers_array[i],insertId] , (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.insertId2);
                    }) 
                });
                insertId2_array.push(insertId2);
                
            }
            return {
                question_id : insertId,
                insertId2_array : insertId2_array,
                title : title,
                answers_array : answers_array
            };
        } catch (error) {
            console.log(error);
        }
    }


    /* route : /getSurveysSummary | use : get questions and answers of the created questionnaire in order for the user to define the flow */
    async getSurveysSummary() {
        try {
            const response2 = await new Promise((resolve, reject) => {
                const query42 = "SELECT id FROM survey ORDER BY id DESC LIMIT 0, 1;";

                connection.query(query42, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            const response = await new Promise((resolve, reject) => {
                const query77 = "select que.id as qid, ans.id as ansid, que.title as qtitle, ans.title as anstitle, que.required as required, que.qtype as qtype from survey as sur inner join questions as que on que.survey_id=sur.id inner join answers as ans on ans.whose_question_id=que.id where sur.id=?;";
                connection.query(query77, [response2[0].id] ,(err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    
    /* route : /updateFlow | use : update the flow according to the input of the creator of the questionnaire */
    async updateFlow(flow_array, help_array, flow_counter) {
        try {
            var response3;
            for(var j = 0; j < flow_counter; j++){
                response3 = await new Promise((resolve, reject) => {
                var query17 = "UPDATE answers SET next_question_id = ? WHERE id = ?";
    
                connection.query(query17, [flow_array[j], help_array[j]] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
            }
            return response3 === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    


    /* route : /answer_survey/:sesID/:surID | use : get the questionnaire that the user chooses to answer in a specific session*/
    async getRequestedSurvey(survID,sessID) {
        try {
            let error = false;
            //get the first question of the questionnaire
            const response45 = await new Promise((resolve, reject) => {
                const query100 = "SELECT que.id as queid FROM questions as que inner join survey as sur on sur.id=que.survey_id where sur.id=? ORDER BY que.id ASC LIMIT 0, 1;";

                connection.query(query100,[survID] ,(err,results) => {
                    if (err) {error = true};
                    resolve(results); 
                })
            });
            //get the details of the first question
            const response69 = await new Promise((resolve, reject) => {
                const query88 = "select ? as sessID ,que.id as quesid, que.title as questitle, ans.title as atitle, ans.next_question_id as nextque, ans.id as answerid, sur.id as surid, cat.title as cattitle from questions as que inner join answers as ans on que.id=ans.whose_question_id inner join survey as sur on sur.id=que.survey_id inner join category as cat on cat.id=que.category_id where que.id=?;";

                connection.query(query88, [sessID,response45.length!=0?response45[0].queid:-1], (err,results) => {
                    if (err) {error = true};
                    if(!err) resolve(results); else resolve();
                })
            });
            
            return (!error) ? response69 : [];  // if an error occured, return empty list so that API can return error message and error code to the user
        
        } catch (error) {
            console.log(error);
        }
    
    }
    
    /* route : /login/:email/:pass | use : get the role of the person who is trying to login - if no such user or admin exists return empty list -> invalid credentials*/
    async checkCredentials(email,password) {
        try {
            let error = false;
            const insertId23 = await new Promise((resolve, reject) => {
                const query888 = "select roles from registered_users where email=? and pass_word=?;"
                connection.query(query888,[email,password] ,(err, results) => {
                    if (err) error=true;
                    if(!err)resolve(results); else resolve();
                })
            });
            return (!error)? insertId23 : []; // if an error occured, return empty list so that API can return error message and error code to the user
        } catch (error) {
            console.log(error);
        }
    }
    

    async Save_new_value(button_value) {
        try {
            const insertId20 = await new Promise((resolve, reject) => {
                const query37 = "INSERT INTO values_storage(saved_value) VALUES (?);";

                connection.query(query37, [button_value] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId20);
                    console.log(result.affectedRows + " record inserted");
                })
            });
            return {
                id : insertId20,
                button_value : button_value,
            };
        } catch (error) {
            console.log(error);
        }
    }

 
    
    /* route : /next_question/:option/:sessionID | use : get the next question of the questionnaire according to the given answer in the previous question*/
    async getNextQuestion(option,sessionID) {
        try {
            let error = false;
            const response12 = await new Promise((resolve, reject) => {
                const query101 = "select next_question_id as nextq from answers where id=?;"

                connection.query(query101,[option] ,(err,results) => {
                    if (err) error=true;
                    if(!err)resolve(results);else resolve();
                })
            });

            const response70 = await new Promise((resolve, reject) => {
                const query89 = "select ? as sessID, que.id as quesid, que.title as questitle, ans.title as atitle, ans.next_question_id as nextque, ans.id as answerid, sur.id as surid, cat.title as cattitle from questions as que inner join answers as ans on que.id=ans.whose_question_id inner join survey as sur on sur.id=que.survey_id inner join category as cat on cat.id=que.category_id where que.id=?;";

                connection.query(query89, [sessionID,response12.length!=0?response12[0].nextq:-1], (err,results) => {
                    if (err) error=true;
                    if(!err)resolve(results);else resolve();
                })
            });
            return !error?response70:[]; // if an error occured, return empty list so that API can return error message and error code to the user
        } catch (error) {
            console.log(error);
        }
    }


    /* route : /create_session/:value | use : create a new session when a questionnaire is going to be answered*/
    async createNewSession(survID) {
        try {
            let error = false;
            //random session ID with 4 random characters
            let sesID = Buffer.from(Math.random().toString()).toString("base64").substring(10,14);
            const insertId32 = await new Promise((resolve, reject) => {
                const query38 = "INSERT INTO session (session_id,survey_id, registered_users_id) VALUES (?,?, 1);";

                connection.query(query38, [sesID,survID] , (err, result) => {
                    if (err) {error=true};
                    if(!err) resolve(result.insertId32); else resolve();
                })
            });
            
            return (!error)?{
                session_id:sesID,
                survID:survID
            }:[];  // if an error occured, return empty list so that API can return error message and error code to the user
        } catch (error) {
            console.log(error);
        }
    }

    async CLIcreateNewSession(survID,sessionID) {
        try {
            let error = false;
            const insertId32 = await new Promise((resolve, reject) => {
                const query38 = "INSERT INTO session (session_id,survey_id, registered_users_id) VALUES (?,?, 1);";

                connection.query(query38, [sessionID,survID] , (err, result) => {
                    if (err) {error=true};
                    if(!err) resolve(result.insertId32); else resolve();
                })
            });
            
            return (!error)?{
                session_id:sessionID,
                survID:survID
            }:[];  // if an error occured, return empty list so that API can return error message and error code to the user
        } catch (error) {
            console.log(error);
        }
    }



    /* route : /doanswer/:questionnaireID/:questionID/:session/:optionID | use : save the given answer in a question*/
    async SaveGivenAnswer(sessionID,optionID) {
        try {
            let error = false;
            const insertId53 = await new Promise((resolve, reject) => {
                const query53 = "INSERT INTO answers_registered_users VALUES (?,?, ?);";
                connection.query(query53, [optionID, 1, sessionID] , (err, result) => {
                    if (err) error=true;
                    if(!err)resolve(result.insertId53); else resolve();
                })
            });
            
            
            return !error?{
                insertId53 : insertId53,
                sessionID : sessionID,
                optionID : optionID
            }:[]; // if an error occured, return empty list so that API can return error message and error code to the user
        } catch (error) {
            console.log(error);
        }
    }
        

    
    /* route : /getquestionanswers/:questionnaireID | use : get all the question of the questionnaire*/
    async getSurveysQuestions(questionnaireID) {
        try {
            let error = false;
            const insertId23 = await new Promise((resolve, reject) => {
                const query888 = "select sur.title as surTitle, que.title as queTitle, que.id as queID, sur.id as surID from survey as sur inner join questions as que on que.survey_id=sur.id where sur.id=?;"
                connection.query(query888,[questionnaireID] ,(err, results) => {
                    if (err) error=true;
                    if(!err)resolve(results); else resolve();  
                })
            });
            console.log(insertId23);
            return (!error)? insertId23 : []; // if an error occured, return empty list so that API can return error message and error code to the user
        } catch (error) {
            console.log(error);
        }
    }


    
    /* route : /getquestionanswers/:questionnaireID/:questionID | use : get all the answers given in a specific question of a specific questionnaire in all sessions*/
    async getStatistics(questionID) {
        try {
            let error = false;
            const insertId23 = await new Promise((resolve, reject) => {
                const query888 = "select first.surID as surID, first.Survey, first.Session, first.Question, first.AnswerTitle, concat(left(first.Time_Stamp,10),' ,  ',right(first.Time_Stamp,8)) as Time from (select sur.id as surID, sur.title as Survey, ses.session_id as Session, que.title as Question, ans.id as Answer, ans.title as AnswerTitle, ses.Time_Stamp as Time_Stamp from survey as sur inner join session as ses on ses.survey_id=sur.id inner join questions as que on que.survey_id=sur.id inner join answers as ans on ans.whose_question_id=que.id where que.id=?) as first inner join answers_registered_users as second on first.Answer=second.answers_id and first.Session=second.session_id order by Time_Stamp;"
                connection.query(query888,[questionID] ,(err, results) => {
                    if (err) error=true;
                    if(!err)resolve(results);else resolve();
                })
            });
            console.log(insertId23);
            return (!error)? insertId23:[]; // if an error occured, return empty list so that API can return error message and error code to the user
        } catch (error) {
            console.log(error);
        }
    }
           
    
    
     /* route : /getsessionanswers/:questionnaireID/:session | use : get the answers given in all questions of a specific questionnaire in a specific session*/
    async getSummary(sessionID, questionnaireID) {
        try {
            let error = false;
            const response87 = await new Promise((resolve, reject) => {
                const query101 = "select que.survey_id as quesid, an.session_id as sessionid, que.id as queid, que.title as quetitle, ans.id as ansid, ans.title as anstitle from answers_registered_users as an inner join answers as ans on an.answers_id = ans.id inner join questions as que on que.id = ans.whose_question_id where session_id = ? and que.survey_id = ?;"

                connection.query(query101,[sessionID, questionnaireID] ,(err,results) => {
                    if (err) error=true;
                    if(!err)resolve(results); else resolve();
                })
            });
            return !error?response87:[]; // if an error occured, return empty list so that API can return error message and error code to the user
        } catch (error) {
            console.log(error);
        }
    }


    
    /* route : /admin/healthcheck | use : get healthcheck parameters, such as DB information and status*/
    async getHealthcheck() {
        let status;
        console.log(connection.state);
        if(connection.state == 'authenticated'){
            status = 'OK';
        }
        else {
            status = 'failed';
        }
        try {
            const response88 = await new Promise((resolve, reject) => {
                const query101 = "select ? as status, ? as Server, ? as sqlport, ? as Database1, ? as User_Id, ? as password;";

                connection.query(query101,[status, connection.config.host, connection.config.port, connection.config.database, connection.config.user, connection.config.password] ,(err,results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            console.log('response:', response88);
            return response88;
        } catch (error) {
            console.log(error);
        }
    }


    
    /* route : /admin/questionnaire_upd | use : add a new questionnaire (and all of its questions and answers), given in a json input file*/
    async newSurveyJson(surID, surTitle,keywords,questions) {
        try {
            let error=false;
            const insertId57 = await new Promise((resolve, reject) => {
                const query53 = "INSERT INTO survey VALUES (?,?,?);";

                connection.query(query53, [surID, surTitle, keywords] , (err, result) => {
                    if (err) {error=true;}
                    if(!err)resolve(result.insertId57); else resolve();
                })
            });
            
            let N = questions.length;
            for(var i = 0  ; i < N ; i++){
                var insertId54 = await new Promise((resolve, reject) => {
                    var query54 = "INSERT INTO questions VALUES (?,?, ?, ?, 1, ?);";
    
                    connection.query(query54, [questions[i].qID, questions[i].qtext, questions[i].required,questions[i].type,surID] , (err, result) => {
                        if (err) error=true;
                        if(!err)resolve(result.insertId54); else resolve();
                    })
                });
                let ansN = questions[i].options.length;
                console.log(ansN);
                for(var j = 0 ; j < ansN ; j++){
                    console.log(questions[i].options[j].optID, questions[i].options[j].opttxt,questions[i].qID,questions[i].options[j].nextqID);
                    var insertId55 = await new Promise((resolve, reject) => {
                        var query55 = "INSERT INTO answers VALUES (?,?,?,?);";
        
                        connection.query(query55, [questions[i].options[j].optID, questions[i].options[j].opttxt,questions[i].qID,questions[i].options[j].nextqID] , (err, result) => {
                            if (err) error=true;
                            if(!err)resolve(result.insertId55); else resolve();
                        })
                    });
                }
            }
            
            return (!error)?{
                insertId57:insertId57,
                surID : surID,
                surTitle : surTitle,
                keywords : keywords,
                questions : questions
                
            }:[]; // if an error occured, return empty list so that API can return error message and error code to the user
        } catch (error) {
            console.log(error);
        }
    }


    /* route : /admin/resetall | use : reset all parameters of the system*/
    async resetAll() {
        try {
            const insertId53 = await new Promise((resolve, reject) => {
                const query4 = "DELETE from answers_registered_users;";

                connection.query(query4, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId53);
                })
            });
            const insertId5 = await new Promise((resolve, reject) => {
                const query4 = "DELETE from session;";
                connection.query(query4, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId53);
                })
            });
            const insertId6 = await new Promise((resolve, reject) => {
                const query5 = "DELETE from values_storage;";
                connection.query(query5, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId6);
                })
            });
            const insertId7 = await new Promise((resolve, reject) => {
                const query6 = "DELETE from registered_users where roles = 'user';";
                connection.query(query6, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId7);
                })
            });
            const insertId8 = await new Promise((resolve, reject) => {
                const query7 = "DELETE from answers;";
                connection.query(query7, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId8);
                })
            });
            const insertId11 = await new Promise((resolve, reject) => {
                const query10 = "DELETE from questions_category;";
                connection.query(query10, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId11);
                })
            });
            const insertId9 = await new Promise((resolve, reject) => {
                const query8 = "DELETE from questions;";
                connection.query(query8, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId9);
                })
            });
            const insertId10 = await new Promise((resolve, reject) => {
                const query9 = "DELETE from survey;";
                connection.query(query9, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId10);
                })
            });

            return {
                status : 'OK',
                reason : 42
            };
        } catch (error) {
            return {
                status : 'failed',
                reason : error
            }
        }
    }
   

    /* route : /getsurveydetails/:questionnaireID | use : get info about every questionnaire such as the title, keyword, questions, type of questions...*/
    async getSurveyDetails(questionnaireID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "select sur.id as surID, sur.title as surTitle, sur.keywords as surKey, que.id as queID, que.title as queTitle, required, qtype from survey as sur inner join questions as que on sur.id=que.survey_id where sur.id = ? ;";

                connection.query(query, [questionnaireID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    
    /* route : /getquestiondetails/:questionID | use : get info about every question (i.e. answers, flow - next questions)*/
    async getQuestionDetails(questionID) {
        try {
            let error = false;
            const response = await new Promise((resolve, reject) => {
                const query = "select surID, queID, queTitle, required, qtype, ansID, ansTitle, nextID, nextq_title from(select survey_id as surID, que.id as queID, que.title as queTitle, required, qtype, ans.id as ansID, ans.title as ansTitle, next_question_id as nextID from questions as que inner join answers as ans on que.id = whose_question_id where que.id = ?) as first inner join (select title as nextq_title,id from questions) as second on first.nextID=second.id union select survey_id as surID, que.id as queID, que.title as queTitle, required, qtype, ans.id as ansID, ans.title as ansTitle, next_question_id as nextID,'End of the Questionnaire' as nextq_title  from questions as que inner join answers as ans on que.id = whose_question_id where que.id = ? and next_question_id=0 ;";

                connection.query(query, [questionID,questionID], (err, results) => {
                    if (err) error=true;
                    if(!err)resolve(results); else resolve();
                })
            });
            
                return (!error)? response : []; // if an error occured, return empty list so that API can return error message and error code to the user
        } catch (error) {
            console.log(error);
        }
    }


    /* route : /admin/createUser | use : insert a new user or admin*/
    async createUser(username, password,id) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO registered_users (id,email, pass_word, roles) VALUES (?,?, ?, 'user');";

                connection.query(query, [id,username, password] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                    console.log(result.affectedRows + " record inserted");
                })
            });
            return {
                id : insertId,
                username : username,
                password : password
            };
        } catch (error) {
            console.log(error);
        }
    }


    
    /* route : /admin/resetq/:questionnaireID | use : reset all parameters of a questionnaire*/
    async resetQuestionnaire(surveyID) {
        try {
            const insertId53 = await new Promise((resolve, reject) => {
                const query4 = "delete from answers_registered_users where answers_id in(select ans.answers_id from answers_registered_users as ans inner join session as ses on ses.session_id = ans.session_id where ses.survey_id = ?);";

                connection.query(query4, [surveyID], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId53);
                })
            });
            const insertId5 = await new Promise((resolve, reject) => {
                const query4 = "DELETE from session where survey_id = ?;";
                connection.query(query4, [surveyID], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId53);
                })
            });

            return {
                status : 'OK',
                reason : 42
            };
        } catch (error) {
            return {
                status : 'failed',
                reason : error
            }
        }
    }




   
    async checkIfSessionExists(sessionID) {
        try {
            let error = false;
            const response = await new Promise((resolve, reject) => {
                const query = "select session_id from session where session_id=?;";

                connection.query(query, [sessionID], (err, results) => {
                    if (err) error=true;
                    if(!err)resolve(results); else resolve();
                })
            });
               // console.log(response);
                return (!error)? response : []; // if an error occured, return empty list so that API can return error message and error code to the user
        } catch (error) {
            console.log(error);
        }
    }




    /* route : /cli/doanswer/:questionnaireID/:questionID/:session/:optionID | use : same as SaveGivenAnswer() but using CLI*/
    async CliSaveGivenAnswer(surveyID,sessionID,optionID) {
        /// later: function to check if the given sessionID already exists OR trigger in database
        try {
            let error=false;
            const insertId115 = await new Promise((resolve, reject) => {
                const query115 = "INSERT INTO answers_registered_users (answers_id,registered_users_id,session_id) VALUES (?,?, ?);";

                connection.query(query115, [optionID, 1, sessionID] , (err, result) => {
                    if (err) error=true;
                    if(!err)resolve(result.insertId115);else resolve();
                })
            });
        
            return (!error)?{
                status : 'OK'
            }:[]; // if an error occured, return empty list so that API can return error message and error code to the user
        } catch(error) {
            console.log(error);
        }
    }


}
module.exports = DbService;
