/* When the page is loaded the following route is called for the healthcheck to be performed. 
The data returned is then displayed for the user to see in the frontend.                  */
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/admin/healthcheck')
    .then(response => response.json())
    .then(data => loadHTML(data['data']));
    
});

//Display data regarding the healthcheck of the system. 
function loadHTML(data) {
    const table = document.querySelector('#healthcheck_page');
    let tableHtml = "";
    data.forEach(function ({status, Server, sqlport, Database1, User_Id, password}) {
        tableHtml += `<h2>{"status":${status}, "dbconnection":[Server=' ${Server}:5000' ,${sqlport}'; 'Database=' + ${Database1}+';' 'User Id='+ ${User_Id} + ';' 'Password=${password};]}</h2>`;
    });

    table.innerHTML = tableHtml;
}