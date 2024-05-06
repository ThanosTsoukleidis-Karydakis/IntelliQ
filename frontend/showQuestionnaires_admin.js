/*When the page is loaded, all questionnaires are brought and displayed as a table */
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAllQuestionnaires')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    
});

var help_counter = 0;
/* Load data and display them in a table format */
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    //in case of no questionnaires:
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='3'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    //create one row for each stored questionnaire and the necessary buttons for each one
    data.forEach(function ({id, title, keywords}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${title}</td>`;
        tableHtml += `<td>${keywords}</td>`;
        tableHtml += `<td>`;
        tableHtml += `<button id="${help_counter}" onclick="ShowQuestions(${id})" value="${id}">Statistics</button>`;
        tableHtml += `<button id="${help_counter}" onclick="resetQuestionnaire(${id})" value="${id}">Reset</button></td>`;
        tableHtml += "</tr>";
        help_counter +=1;
    });

    table.innerHTML = tableHtml;
}

//On press of the Statistics button. Shows a list of the questions of this questionnaire to pick one.
//The responsible endpoint gets the data asked for. 
function ShowQuestions(questionnaireID) {
    fetch('http://localhost:5000/getquestionanswers/' + questionnaireID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => QuestionStat(data['data']));  //display the questions of this questionnaire to the user
}

// display the questions to the user. The user then chooses a question to check its statistics. 
function QuestionStat(data) {
    const table = document.querySelector('#showSurveys_main');
    let tableHtml = "";
    let counter = 0 ;
    //Iteratively display each question with its button
    data.forEach(function ({surTitle, queTitle, queID, surID}) {  
         if(counter==0)tableHtml += `<h1>Survey : ${surTitle}</h1>`;     
         tableHtml += `<h3>${queTitle}  `;
         tableHtml += " "
         tableHtml += ` <button class="statistic-button" id="${queID}" name="${surTitle}" onclick="Statistics(${queID},${surID})", value="5">See Statistics</button></h3>`;
         counter++
 });
    tableHtml += ` <button id="stat_back" onclick="goBack()">Back</button></h3>`;
    table.innerHTML = tableHtml;
}

function goBack(){
    location.replace('showQuestionnaires_admin.html');
}


//Fetch statistics for the selected question (on click of the See Statistics button)
function Statistics(questionID,questionnaireID) {
    fetch('http://localhost:5000/getquestionanswers/' + questionnaireID +'/' + questionID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => DisplayQuestionStatistics(data['data'],questionnaireID));   //display the results to the user with this function
}


//Display the question statistics to the user
function DisplayQuestionStatistics(data,questionnaireID) {
    const table = document.querySelector('#showSurveys_main');
    let tableHtml = "";
    let counter = 0;
    let data2=[];
    data.forEach(function ({Survey, Session, Question,AnswerTitle, Time}) {  
        if(counter==0) {
            data2.push({x:AnswerTitle, value:0});
            tableHtml += `<h1>${Survey} : `;
            tableHtml += `${Question}</h1>`;
            tableHtml += `<div id="container" style="position: relative; left: 0px; top: 0px; overflow: hidden; width: 100%; height: 330px;"></div>`
            tableHtml += `<h1>Detailed Results : </h1>`;
        }
        if(data2.findIndex(element=>element.x==AnswerTitle)==-1)data2.push({x:AnswerTitle, value:1});
        else data2[data2.findIndex(element=>element.x==AnswerTitle)].value+=1
         tableHtml += `<h3>Session : ${Session}   |   Answer : ${AnswerTitle} (Time :${Time})</h3><br> `;
         counter++;
 });

 if(counter!=0)tableHtml += `<button onclick="StatBack(${questionnaireID})">Back</button>`;
 else {
     tableHtml += `<br><br><br><h1>No Data</h1>`;
    // console.log(survey);
    tableHtml += `<br><br><br><br><button onclick="StatBack(${questionnaireID})">Back</button>`;
    
 }
    
    table.innerHTML = tableHtml;
    draw_chart(data2);
}

function StatBack(survey){
    ShowQuestions(survey);
}

// draw the pie chart
function draw_chart(data){
anychart.onDocumentReady(function() {
    // create the chart
    var chart = anychart.pie();
  
    // set the chart title
    chart.title("Pie Chart");
    chart.fill("aquastyle");
    chart.labels().position("outside");
    // add the data
    chart.data(data);
  
    // display the chart in the container
    chart.container('container');
    chart.draw();
  
  });
}


//Back button after checking statistics of a question
function Back(){
    location.replace('showQuestionnaires_admin.html');
}

let helper;
//Show the summary of selected answers to the user
function DisplaySummary(data) {
    const main = document.querySelector('#showSurveys_main');
    let counter = 1;
    let tableHtml = "";
    tableHtml += "<h2><b>Summary of your selected answers</b></h2>"
    data.forEach(function ({ anstitle, quetitle, quesid }) { 
            helper = quesid;
            tableHtml += `<h3>Question ${counter} : ${quetitle}</h3>`   
            tableHtml += "<h3>";
            tableHtml += `Selected Answer: ${anstitle}</h3><br><br>`;
            counter += 1;
    });
    tableHtml +=`<div class='button'>`;
    tableHtml += `<button id="end-summary" onclick="finish(helper)">Finish</button>`;
    tableHtml +=`</div>`;
    main.innerHTML = tableHtml;
}

//On click of the finish button, display a confirm message
function finish(helper){
    console.log("helper: ", helper);
    if(confirm('Your Questionnaire has been submitted! If you wish to answer another one click OK. If you wish to reanswer this one click "Cancel"')){
    location.replace('showQuestionnaires_admin.html');
    }
    else{ 
        createSession(helper);
    }
}


/* Load the question and display it to the user for the data that it has been called for */
function loadQuestion(data) {
    const main = document.querySelector('#showSurveys_main');
    let tableHtml = "";
    let help_title="";
    let last = true;
    var sessionID ;
    tableHtml += `<h1>Answer that Question<h1>`;
    data.forEach(function ({quesid, questitle,atitle, nextque, answerid, surid, sessID}) {       
           if(help_title!=questitle) tableHtml += `<h2>Question : ${questitle}</h2>`;
            tableHtml += "<h3>";
            tableHtml += `<input type="radio" class="form-control" id="${answerid}" name="${surid}" value="${quesid}">`;
            tableHtml +=`<label for="html"> ${atitle}</label><br></br></h3>`
            help_title = questitle;
            if(nextque==0)last=false;
            sessionID = sessID;
    });
    //display a next button if we are not talking about the last question
    if(last!=true){
        tableHtml +=`<div class='button'>`;
        tableHtml += `<button id="next-question-btn" onclick="next_question('${sessionID}')">Next</button>`;
        tableHtml +=`</div>`;
    }
    //display an end button if we are talking about the last question
    else {
        tableHtml +=`<div class='button'>`;
        tableHtml += `<button id="end-answer-btn" onclick="end('${sessionID}')">End</button>`;
        tableHtml +=`</div>`;
    }

    main.innerHTML = tableHtml;
}

//On click of the end button after answering the last question this function is called to submit the answer
function end(sessionID) {
    var ele = document.getElementsByClassName('form-control');
            for(i = 0; i < ele.length; i++) {
                if(ele[i].checked){
                    
                    fetch('http://localhost:5000/doanswer/'+ele[i].name+'/'+ele[i].value+'/'+ sessionID +'/'+ele[i].id, {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'POST'
                    })
                    .then(response => response.json());
                    
                }
                    
            }
    location.replace('index.html');   //we have finished answering the questionnaire
}

//On click of the next button after answering a specific question this function is called to submit the answer
function next_question(sessionID) {
    var ele = document.getElementsByClassName('form-control');
            for(i = 0; i < ele.length; i++) {
                if(ele[i].checked){
                    
                    let option = ele[i].id;
                    fetch('http://localhost:5000/doanswer/'+(ele[i].name)+'/'+(ele[i].value)+'/'+ sessionID +'/'+(ele[i].id), {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'POST'
                    })
                    .then(response => response.json());
                    FindNextQuestion(option,sessionID);           //function called to find the next question that needs to appear
                }
            }
}

//On click of the answer button. It creates a new session for the user to answer the questionnaire
function createSession(surveyID) {
    fetch('http://localhost:5000/create_session/'+surveyID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST'
    })
    .then(response => response.json()).then(data => GetFirstQuestion(data['data']));
}

/* It brings the first question of the selected questionnaire for the user to answer */
function GetFirstQuestion(Data) {
    let sesID = Data.session_id;
    let survID = Data.survID;

    fetch('http://localhost:5000/answer_survey/'+sesID+'/'+survID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => loadQuestion(data['data']));
}

//find the next question to be answered according to the selected answer and the determined flow
function FindNextQuestion(option,sessionID) {
    fetch('http://localhost:5000/next_question/'+option+'/'+sessionID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => loadQuestion(data['data']));   //display the question to the user

}

//On click of the reset button for a specific questionnaire. It resets all answer data from this specific questionnaire
function resetQuestionnaire(surveyID) {
    fetch('http://localhost:5000/admin/resetq/'+surveyID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST'
    })
    .then(response => response.json()).then(data => ShowMessage(data['data']));
}

function ShowMessage(Data) {
   let boole = false;
   if(Data.reason == 42) {boole = true};   //checking if the deletion went good
   if(boole == true){
    Data = JSON.stringify(Data);           //show JSON object to the admin
    Data = Data.substring(Data, 14, -2);
    }
    else {
        Data = JSON.stringify(Data);
    }
    //confirm message that the data have been reset
    if(confirm(`${Data}} :  All answers for this questionnaire have been reset!`)){
        location.replace('showQuestionnaires_admin.html');
        }
        else{ 
            location.replace('showQuestionnaires_admin.html');
        }
}


// Search Bar Implementation
(function() {
	'use strict';

var TableFilter = (function() {
 var Arr = Array.prototype;
		var input;
  
		function onInputEvent(e) {
			input = e.target;
			var table1 = document.getElementsByClassName(input.getAttribute('data-table'));
			Arr.forEach.call(table1, function(table) {
				Arr.forEach.call(table.tBodies, function(tbody) {
					Arr.forEach.call(tbody.rows, filter);
				});
			});
		}

		function filter(row) {
			var text = row.textContent.toLowerCase();
      var val = input.value.toLowerCase();
			row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
		}

		return {
			init: function() {
				var inputs = document.getElementsByClassName('table-filter');
				Arr.forEach.call(inputs, function(input) {
					input.oninput = onInputEvent;
				});
			}
		};
 
	})(); 
 TableFilter.init(); 
})();
