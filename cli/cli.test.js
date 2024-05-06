/*Testing all the CLI commands*/ 

const chaiExec = require("@jsdevtools/chai-exec");
const chai = require("chai");
let chaiHttp = require('chai-http');

chai.use(chaiExec);

describe("CLI_Testing", () => {
  // testing command questionnaire_upd 
  it("Upload a json file with a new questionnaire with id=100 :\n\t COMMAND : questionnaire_upd --source example4.json", () => {
    let myCLI = chaiExec('questionnaire_upd --source example4.json'); // execute the command
    chai.expect(myCLI.exitCode).to.equal(200); // it should return status 200
  });

  // testing command doanswer 
  it("Post the answerID of a specific question of a questionnaire in a given session. \n\t COMMAND : doanswer --questionnaire_id 100 --question_id 101 --session_id LOVE --option_id 102", () => {
    let myCLI = chaiExec('doanswer --questionnaire_id 100 --question_id 101 --session_id LOVE --option_id 102'); // execute the command
    chai.expect(myCLI.exitCode).to.equal(200);  // it should return status 200
  });

  // testing command getquestionanswers 
  it("Get all given answers in a specific question of a specific questionnaire. \n\tCOMMAND : getquestionanswers --questionnaire_id 100 --question_id 101 --format json", () => {
    let myCLI = chaiExec('getquestionanswers --questionnaire_id 100 --question_id 101 --format json'); // execute the command
    chai.expect(myCLI.exitCode).to.equal(200); // it should return status 200
  });

  // testing command getsessionanswers
  it("Get all questions΄ answers in a given session. \n\tCOMMAND : getsessionanswers --questionnaire_id 100 --session_id LOVE --format json", () => {
    let myCLI = chaiExec('getsessionanswers --questionnaire_id 100 --session_id LOVE --format json'); // execute the command
    chai.expect(myCLI.exitCode).to.equal(200);  // it should return status 200
  });

  // testing command healthcheck
  it("This command returns the current status of the server (whether it is running or not plus database info). \n\tCOMMAND : healthcheck --format json", () => {
    let myCLI = chaiExec('healthcheck --format json'); // execute the command
    chai.expect(myCLI.exitCode).to.equal(200); // it should return status 200
  });

  // testing command resetq
  it("Reset answer data of a specific questionnaire \n\tCOMMAND : resetq --questionnaire_id 100 --format json", () => {
    let myCLI = chaiExec('resetq --questionnaire_id 100 --format json'); // execute the command
    chai.expect(myCLI.exitCode).to.equal(200);  // it should return status 200
  });

  // testing command questionnaire
  it("Show all questions of a specific questionnaire \n\tCOMMAND: questionnaire --questionnaire_id 100 --format json", () => {
    let myCLI = chaiExec('questionnaire --questionnaire_id 100 --format json'); // execute the command
   chai.expect(myCLI.exitCode).to.equal(200);  // it should return status 200
  });

  // testing command question
  it("Show all answers of a specific question of a questionnaire \n\tCOMMAND: question --questionnaire_id 100 --question_id 101 --format json", () => {
    let myCLI = chaiExec('question --questionnaire_id 100 --question_id 101 --format json'); // execute the command
    chai.expect(myCLI.exitCode).to.equal(200); // it should return status 200
    });

  // testing command resetall  
  it("Reset all data of our database \n\tCOMMAND: resetall --format json", () => {
    let myCLI = chaiExec('resetall --format json'); // execute the command
    chai.expect(myCLI.exitCode).to.equal(200); // it should return status 200
  });
});
