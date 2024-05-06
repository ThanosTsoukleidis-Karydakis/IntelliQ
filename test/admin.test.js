/*Testing for an admin's use case : login, insert a new questionnaire giving title and keyword 
and insert three questions with two possible answers for each one of them.
Get the Summary of the created questionnaire and define the flow
*/ 

let db = require("../api-backend/dbService");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../api-backend/app');
let should = chai.should();
var token;

chai.use(chaiHttp);

describe('Admin', () => {

  // Login as an admin
  describe('/login/:email/:pass', () => {
      it('it should login an admin with correct username and password', (done) => {
        const admin = {
          username: "thanos@mail.gr", // admin's account
          password: "hello2"
        }
        chai.request(server)
            .get('/login/'+admin.username+'/'+admin.password)
            .end((err, res) => {
                  res.should.have.status(200); // it should return status 200
              done();
            });
      });
  });

  // Insert a new questionnaire giving title and keyword
  describe('/insert', () => {
    it('it should create a new questionnaire with title and keyword', (done) => {
      const survey = {
        title: "Music Interests",
        keyword: "music"
      }
      chai.request(server)
          .post('/insert')
          .send(survey)
          .end((err, res) => {
                res.should.have.status(200); // it should return status 200
            done();
          });
    });
});

// Add the first question giving all the required parameters
describe('/addQuestion', () => {
    it('it should add the first question of the questionnaire', (done) => {
      const question1 = {
        title: "Favourite Genre of Music",
        answers_array: ['post punk', 'new wave'],
        times: 2,
        checkbox: false,
        qtype: false,
        category: "Music"
      }
      chai.request(server)
          .post('/addQuestion')
          .send(question1)
          .end((err, res) => {
                res.should.have.status(200); // it should return status 200
            done();
          });
    });
});

// Add the second question giving all the required parameters
describe('/addQuestion', () => {
    it('it should add the second question of the questionnaire', (done) => {
      const question2 = {
        title: "Favourite Post punk band",
        answers_array: ['Joy Division', 'The Smiths'],
        times: 2,
        checkbox: false,
        qtype: false,
        category: "Music"
      }
      chai.request(server)
          .post('/addQuestion')
          .send(question2)
          .end((err, res) => {
                res.should.have.status(200); // it should return status 200
            done();
          });
    });
});


// Add the third question giving all the required parameters
describe('/addQuestion', () => {
    it('it should add the third question of the questionnaire', (done) => {
      const question3 = {
        title: "Favourite new wave band",
        answers_array: ['Depeche Mode', 'Tears for Fears'],
        times: 2,
        checkbox: false,
        qtype: false,
        category: "Music"
      }
      chai.request(server)
          .post('/addQuestion')
          .send(question3)
          .end((err, res) => {
                res.should.have.status(200);  // it should return status 200
            done();
          });
    });
});


// Get the summary of the questionnaire
let answers_ids = [];
let questions_ids = [];
describe('/getSurveysSummary', () => {
    it('it should display the summary of all created questions for this questionnaire', (done) => {
      chai.request(server)
          .get('/getSurveysSummary')
          .end((err, res) => {
            var help = 0;
               res.should.have.status(200); // it should return status 200
               var json = JSON.parse(res.res.text);
               for(let i = 0; i < (json["data"]).length; i++){
                answers_ids.push(json["data"][i].ansid);
                if(help != json["data"][i].qid){
                   questions_ids.push(json["data"][i].qid);
                   help = json["data"][i].qid;
                }
               }
            done();
          });
    });
}); 


// Define the flow
describe('/updateFlow', () => {
    it('it should update the flow of the questions according to the admin input', (done) => {
      const flow = {
        flow_array: [questions_ids[1], questions_ids[2], 0, 0, 0, 0],
        help_array: answers_ids,
        flow_counter: answers_ids.length
      }
      chai.request(server)
          .patch('/updateFlow')
          .send(flow)
          .end((err, res) => {
                res.should.have.status(200); // it should return status 200
            done();
          });
    });
});
})