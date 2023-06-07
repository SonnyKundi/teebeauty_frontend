const BACKEND_BASE_API = "http://localhost:8000/";

let loginData = {
    email: "",
    password: "",
};

function postAPIData(url, data) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Request failed');
        }
        return response.json(); // Return the parsed JSON response
        })
        .then(data => {
            resolve(data); // Resolve the promise with the API response data
        })
        .catch(error => {
            reject(error);
        });
    });
  };

function onSuccess(googleUser) {
      console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
};

function onFailure(error) {
    console.log(error);
};

function renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSuccess,
      'onfailure': onFailure
    });
};

function login(){
  window.location.href = "index.html";
};

// Sign in workflow
const loginEmailInput = document.getElementById("login-email-input");
const loginPasswordInput = document.getElementById("login-password-input");
const loginSubmitButton = document.getElementById("login-submit-button");

function clearForm(){
    loginEmailInput.value="";
    loginPasswordInput.value="";
    return
};

document.addEventListener("DOMContentLoaded", function(event){
    event.preventDefault();

    // Sign in action listeners
    loginEmailInput.addEventListener("keyup", function(event){
        const value = event.target.value;
        loginEmailInput.value = value;
    });

    loginPasswordInput.addEventListener("keyup", function(event){
        const value = event.target.value;
        loginPasswordInput.value = value;
    });

    loginSubmitButton.addEventListener("click", function(event){
        event.preventDefault();
        const url = BACKEND_BASE_API + "api/token/";

        if(loginEmailInput.value ==="" || loginPasswordInput.value === ""){
        alert("All fields are required");
        return;
        };

        loginData.email = loginEmailInput.value;
        loginData.password = loginPasswordInput.value;
        postAPIData(url, loginData)
        .then(data => {
            alert("Successfully signed in");
            clearForm();
            localStorage.setItem("tersunToken", JSON.stringify(data));
            var token = JSON.parse(localStorage.getItem("tersunToken"));
            login()
        })
        .catch(error => {
            alert(error);
        });
    });
});
