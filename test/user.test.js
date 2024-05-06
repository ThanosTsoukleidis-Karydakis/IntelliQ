/*Testing for a user's use case : login, choose a questionnaire to answer, 
give answers for all the questions and show summary with the given questions 
*/ 

let db = require("../api-backend/dbService");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../api-backend/app');
let should = chai.should();

// We use questionnaire with ID 60 to make this test
let selected_Survey_ID = 60;

chai.use(chaiHttp);

describe('User', () => {
  // Login as a user
  describe('/login/:email/:pass', () => {
      it('it should login a user with correct username and password', (done) => {
        const user = {
          username: "dimitris@mail.gr", // user's account
          password: "hello1"
        }
        chai.request(server)
            .get('/login/'+user.username+'/'+user.password)
            .end((err, res) => {
                  res.should.have.status(200); // it should return status 200
              done();
            });
      });
  });

  var created_session; // save created session here
  // Choose Questionnaire and Create New Session
  describe('/create_session/:value', () => {
    it('it should create a new session for a specific questionnaire', (done) => {
      const survey = {
        ID: selected_Survey_ID
      }
      chai.request(server)
          .post('/create_session/'+survey.ID)
          .end((err, res) => {
            created_session=res.res.text[23]+res.res.text[24]+res.res.text[25]+res.res.text[26];
                res.should.have.status(200);  // it should return status 200
            done();
          });
    });
});


// Get the first question of the chosen questionnaire
describe('/answer_survey/:sesID/:surID', () => {
  it('it should select a specific questionnaire and bring the first question', (done) => {
    const session = {
      ID: created_session,
      surID:selected_Survey_ID
    }
    chai.request(server)
        .get('/answer_survey/'+session.ID+'/'+session.surID)
        .end((err, res) => {
              res.should.have.status(200);  // it should return status 200
          done();
        });
  });
});


let selected_option = -1 ;
// Answer the first question with ID 300 giving the answer with ID 301
describe('/doanswer/:questionnaireID/:questionID/:session/:optionID', () => {
  it('it should save a specific answer of a specific question of questionnaire '+selected_Survey_ID +' in a specific session' , (done) => {
    const doAnswer = {
      surID: selected_Survey_ID,
      queID : 300,
      sesID :created_session,
      optID: 301
    }
    chai.request(server)
        .post('/doanswer/'+doAnswer.surID+'/'+doAnswer.queID+'/'+doAnswer.sesID+'/'+doAnswer.optID)
        .end((err, res) => {
          if(res.status==200){
            let j = JSON.parse(res.res.text);
            selected_option = j.data.optionID; // keep the selected option here in order to go in the next question
          }
              res.should.have.status(200);  // it should return status 200
          done();
        });
  });
});


let next_question = -1;
//Take the Next Question according to the given answer
describe('/next_question/:option/:sessionID', () => {
  it('it should bring the next question according to the previous selected option', (done) => {
    const option = {
      ID: selected_option,
      sesID:created_session
    }
    chai.request(server)
        .get('/next_question/'+option.ID+'/'+option.sesID)
        .end((err, res) => {
          if(res.status==200){
              let j = JSON.parse(res.res.text);
              next_question=j.data[0].quesid;
          }
              res.should.have.status(200);   // it should return status 200
          done();
        });
  });
});

// Answer the next question giving the answer with ID 303
describe('/doanswer/:questionnaireID/:questionID/:session/:optionID', () => {
  it('it should save a specific answer of a specific question of a specific questionnaire in a specific session', (done) => {
    const doAnswer = {
      surID: selected_Survey_ID,
      queID : next_question,
      sesID :created_session,
      optID: 303
    }
    chai.request(server)
        .post('/doanswer/'+doAnswer.surID+'/'+doAnswer.queID+'/'+doAnswer.sesID+'/'+doAnswer.optID)
        .end((err, res) => {
          if(res.status==200){
            let j = JSON.parse(res.res.text);
            selected_option = j.data.optionID;
          }
              res.should.have.status(200);  // it should return status 200
          done();
        });
  });
});


// Get the Summary with your given answer to every question
describe('/getsessionanswers/:questionnaireID/:session', () => {
  it('it should bring the summary', (done) => {
    const survey = {
      ID: selected_Survey_ID,
      sesID:created_session
    }
    chai.request(server)
        .get('/getsessionanswers/'+survey.ID+'/'+survey.sesID)
        .end((err, res) => {
              res.should.have.status(200);  // it should return status 200
          done();
        });
  });
});


})