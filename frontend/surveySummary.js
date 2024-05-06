/*When the page is loaded a form is displayed where the user can choose
the flow ofthe questions he previously defined. This is done with a call
to the following API endpoint                                          */

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getSurveysSummary')
    .then(response => response.json())
    .then(data => loadFlowForm(data['data']));
    
});

var flow_counter;
var flow_array = [];
var help_array = [];
function loadFlowForm(data) {
    const div = document.querySelector('#div_summary');
    flow_counter = 0;
    let tableHtml = "";
    let help_title="";
    var counter ;
    /*For all data that we have gotten from the DB we display it question per question. 
    The user can then choose the flow of the questions.                              */
    data.forEach(function ({qtitle, anstitle,required, ansid, qid, qtype}) {       
        if(help_title!=qtitle){
            //Display the question and the qid that the user will use to determine the flow. The user 
            //will use the qid of the question he wants one question to lead to determine this flow.
            //If one question is a terminal question, the flow input must be left blank. 
            tableHtml += `<h2>(#${qid}) ${qtitle}`;
            if(qtype === 1)tableHtml += ` (Profile)`;
            if(required === 1)tableHtml += ` *`;
            
            counter = 0;
            tableHtml +=`</h2>`;
 
        }
        counter +=1;
        tableHtml += `<h3>${counter}. ${anstitle} `;
        tableHtml += `<input type="text" placeholder="Flow" id="flow_id${flow_counter + 1}">`;
        help_array.push(ansid);
        flow_counter += 1;
        tableHtml += `</h3>`;
        help_title = qtitle;
    });

    div.innerHTML = tableHtml;
}

/*Once the user is finished determining his desired flows, he/she can press this button to fully submit the new 
questionnaire                                                                                                 */
const finishBtn = document.querySelector('#finish-btn');
finishBtn.onclick = function () {
    var help2;
    for(var i = 0; i < flow_counter; i++){
        help2 = i+1;
        flowInput = document.querySelector('#'+'flow_id'+ help2);
        flow_array.push(flowInput.value);
        flowInput.value = "";
    }
    
    /*Calling the responsible API endpoint to submit the chosen flow of questions */
    fetch('http://localhost:5000/updateFlow', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({ flow_array : flow_array, help_array : help_array, flow_counter : flow_counter })
    })
    .then(response => response.json());
    location.replace('index.html');   //redirect back to the index page, having submitted a new questionnaire
}