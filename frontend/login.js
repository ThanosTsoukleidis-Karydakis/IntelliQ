/* Button to complete the login after filling in the user data */
const loginBtn = document.querySelector('#login-btn');
loginBtn.onclick = function () {
    const emailInput = document.querySelector('#email');
    const email = emailInput.value;
    emailInput.value = "";

    const passwordInput = document.querySelector('#password');
    const password = passwordInput.value;
    passwordInput.value = "";
    Validation(email,password);     //Call validation function
}


function Validation(email,password){
    let adm = false;
    /* GET request to check if there is a registered user with the given credentials */
    fetch('http://localhost:5000/login'+'/'+email+'/'+password, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
        
    })
    .then(response => response.json()).then(data => Navigate(data['data']));
    
    /* Check if the returned data is not blank. Then the user exists and is therefore logged in */
    function Navigate(data){
        const wrong = document.querySelector('#wrong_credentials');
        console.log(JSON.stringify(data));
        if(JSON.stringify(data) === '[]'){
            wrong.hidden = false;            //show that the user gave wrong credentials
              
    }
        else {
            let role = data[0].roles;
          
            if(role == 'user'){             //navigate to the user home page if we are talking about a user
                location.replace('showQuestionnaires.html');
                
            }
            else if(role == 'admin'){       //navigate to the admin home page if we are talking about a user
                adm = true;
                location.replace('index.html');
                
                
            }
        }
    }
}

