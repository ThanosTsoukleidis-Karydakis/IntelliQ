var times;

/* Button to submit the number of answers that a specific question will have. On submit, a hidden HTML
section appears after it is dynamically modified to show text inputs for the desired number of answers */
const submitBtn = document.querySelector('#show-noAnswers-btn');
submitBtn.onclick = function () {                     //onlick function for this button
    var input = document.getElementById('noA');
    times = parseInt(input.value);                   
    const div = document.querySelector('#number_of_answers');
    let divHtml = "";
    for(var i = 0; i < times; i++) {                        //show appropriate number of answers' text inputs
        divHtml += `<label>Answer ${i+1}: </label><br>`;    
        divHtml += `<input type="text" id="answer${i+1}"><br><br>`;
    }
    div.innerHTML = divHtml;

    const noAnswers = document.querySelector('#noAnswers');
    noAnswers.hidden = false;                              //show hidden HTML section with all answer text inputs
}


/* Button to submit the current created question and move on to create a new question. On click, it moves the user
to a refreshed page with all input field blank to be filled with the data of the next question     */
const nextBtn = document.querySelector('#next-question-btn');
nextBtn.onclick = function () {
    /*Read the given input from the user */
    const titleInput = document.querySelector('#title');
    let title = titleInput.value;
    titleInput.value = "";

    const checkInput = document.querySelector('#checkbox-rect2');
    const checkbox = checkInput.checked;
    checkInput.checked = false;

    const qtypeInput = document.querySelector('#checkbox-rect3');
    const qtype = qtypeInput.checked;
    qtypeInput.checked = false;

    const e = document.getElementById("ddlViewBy");
    const category = e.value;
    e.value = "";

    /* Warning message if the user tries to create a questionnaire without a title */
    if(title.length == 0) {
        title = ' ';
        if(confirm('Title field cannot be empty')){
            location.replace('createQuestionnaire.html');
        }
        else{ 
            location.replace('createQuestionnaire.html');
        }
    }
    else{
     location.replace('createQuestionnaire.html');
     var answers_array = [];
     var answerInput;
     var help;
     for(var i = 0; i < times; i++) {
         help = i+1; 
         answerInput = document.querySelector('#'+'answer'+help);
         answers_array.push(answerInput.value);
         answerInput.value = "";
     }

     /* Call the responsible API route to add the question with all its necessary fields that the user has given */
     fetch('http://localhost:5000/addQuestion', {
         headers: {
            'Content-type': 'application/json'
         },
         method: 'POST',
         body: JSON.stringify({ title : title, answers_array : answers_array, times:times, checkbox:checkbox, qtype:qtype, category : category})
     })
     .then(response => response.json())
    }
}

/*Button to submit the current question and at the same time signify that this is the last question of the questionnaire*/
const endBtn = document.querySelector('#end-btn');
endBtn.onclick = function () {
  // Read user input for the final question
    const titleInput = document.querySelector('#title');
    let title = titleInput.value;
    titleInput.value = "";

    const checkInput = document.querySelector('#checkbox-rect2');
    const checkbox = checkInput.checked;
    checkInput.checked = false;
    
    const qtypeInput = document.querySelector('#checkbox-rect3');
    const qtype = qtypeInput.checked;
    qtypeInput.checked = false;

    const e = document.getElementById("ddlViewBy");
    const category = e.value;
    e.value = "";

    /* Warning message if the user tries to create a questionnaire without a title */
    if(title.length == 0) {
        title = ' ';
        if(confirm('Title field cannot be empty')){
            location.replace('createQuestionnaire.html');
        }
        else{ 
            location.replace('createQuestionnaire.html');
        }
    }

    else{
     location.replace('surveySummary.html');     //move on to define the flow of the questions
     var answers_array = [];
     var answerInput;
     var help;
     for(var i = 0; i < times; i++) {
         help = i+1; 
         answerInput = document.querySelector('#'+'answer'+help);
         answers_array.push(answerInput.value);
         answerInput.value = "";
     }

     fetch('http://localhost:5000/addQuestion', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ title : title, answers_array : answers_array, times:times, checkbox:checkbox, qtype:qtype, category : category})
     })
     .then(response => response.json())
   }
}


