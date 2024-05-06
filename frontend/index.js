/* Button to add a new questionnaire after defining its title and keyword */

const addBtn = document.querySelector('#create-questionnaire-btn');
addBtn.onclick = function () {
    const titleInput = document.querySelector('#title');
    let title = titleInput.value;

    //Warning to the user that title input can't be empty
    if(title.length == 0) {
        title = ' ';
        if(confirm('Title field cannot be empty')){
            location.replace('index.html');
        }
        else{ 
            location.replace('index.html');
        }
    }

    else{
     titleInput.value = "";

     const keywordInput = document.querySelector('#keyword');
     const keyword = keywordInput.value;
     keywordInput.value = "";

     //Call the responsible API route in order to create a new questionnaire with the input given
     fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ title : title, keyword : keyword})
     })
     .then(response => response.json())
     location.replace('createQuestionnaire.html');    //move on to start adding questions 
                                                      //to the newly created questionnaire
   }
}

/* Button to reset the system (deletes questionnaires, questions, users, given answers etc. Admins and categories don't get deleted) */
const resetBtn = document.querySelector('#resetall-btn');
resetBtn.onclick = function () {
    /* Call the API endpoint that will go on to delete the necessary DB tables */
    fetch('http://localhost:5000/admin/resetall', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => showJSONmessage(data['data']));    //after getting the response, call this function
}

/* A function to display a pop up message that notifies the user of how the reset command went */
function showJSONmessage(data){
    const table = document.querySelector('#resetall_result');
    let tableHtml = "";
    let boole = false;
    if(data.reason == 42) {boole = true};

    if(boole == true){
        data = JSON.stringify(data);
        data = data.substring(data, 14, -2);
        tableHtml += `<h2>${data}}</h2>`;
    }
    else {
        data = JSON.stringify(data);
        tableHtml += `<h2>${data}</h2>`;
    }

    table.innerHTML = tableHtml;
        
    const noAnswers = document.querySelector('#resetall_res');
    noAnswers.hidden = false;  //hidden section gets shown (contains the message)
}

/* In order to upload a JSON file with a new questionnaire (The user has to press the button and choose the file
    and afterwards press upload. The file will be then saved as a new questionnaire in the DB) */
// Get the form and file field
let form = document.querySelector('#upload');
let file = document.querySelector('#file');
// Listen for submit events
form.addEventListener('submit', handleSubmit);
/**
 * Handle submit events
 * @param  {Event} event The event object
 */
function handleSubmit (event) {

	// Stop the form from reloading the page
	event.preventDefault();
}
/**
 * Handle submit events
 * @param  {Event} event The event object
 */
function handleSubmit (event) {

	// Stop the form from reloading the page
	event.preventDefault();

	// If there's no file, do nothing
	if (!file.value.length) return;

}
/**
 * Handle submit events
 * @param  {Event} event The event object
 */
function handleSubmit (event) {

	// Stop the form from reloading the page
	event.preventDefault();

	// If there's no file, do nothing
	if (!file.value.length) return;

	// Create a new FileReader() object
	let reader = new FileReader();

}
/**
 * Handle submit events
 * @param  {Event} event The event object
 */
function handleSubmit (event) {

	// Stop the form from reloading the page
	event.preventDefault();

	// If there's no file, do nothing
	if (!file.value.length) return;

	// Create a new FileReader() object
	let reader = new FileReader();

	// Read the file
	reader.readAsText(file.files[0]);

}
/**
 * Handle submit events
 * @param  {Event} event The event object
 */
function handleSubmit (event) {

	// Stop the form from reloading the page
	event.preventDefault();

	// If there's no file, do nothing
	if (!file.value.length) return;

	// Create a new FileReader() object
	let reader = new FileReader();

	// Setup the callback event to run when the file is read
	reader.onload = logFile;

	// Read the file
	reader.readAsText(file.files[0]);

}
/**
 * Log the uploaded file to the console
 * @param {event} Event The file loaded event
 */
function logFile (event) {
	let str = event.target.result;
	let json = JSON.parse(str);
	console.log('json', json);
    //Call the responsible API endpoint to save the new questionnaire data drawn from the file to the database
    fetch('http://localhost:5000/admin/questionnaire_upd', {
        headers: {
            'Content-type': 'application/json'
        },
    method: 'POST',
    body: JSON.stringify({surID : json.questionnaireID, surTitle : json.questionnaireTitle, keywords : json.keywords, questions : json.questions})
})
.then(response => response.json())
}

