const BACKEND_BASE_API = "http://localhost:8000/";

let userData = {
  user_type: "",
  first_name: "",
  last_name: "",
  other_names: "",
  phone_number: "",
  username: "",
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

function openLoginPage(){
  window.location.href = "login.html";
};

  // Sign up fields
const signupAccountTypeSelect = document.getElementById("signup-account-type-select");
const signupFirstNameInput = document.getElementById("signup-first-name-input");
const signupLastNameInput = document.getElementById("signup-last-name-input");
const signupUserNameInput = document.getElementById("signup-username-input");
const signupEmailInput = document.getElementById("signup-email-input");
const signupPasswordInput = document.getElementById("signup-password-input");
const signupConfirmPasswordInput = document.getElementById("signup-confirm-password-input");
const signupSubmitButton = document.getElementById("signup-submit-button");

function clearForm(){
  signupAccountTypeSelect.selectedIndex = 0
  signupFirstNameInput.value = ""
  signupLastNameInput.value = ""
  signupUserNameInput.value = ""
  signupEmailInput.value = ""
  signupPasswordInput.value = ""
  signupConfirmPasswordInput.value = ""
};

document.addEventListener("DOMContentLoaded", function(event){
  event.preventDefault();

  signupAccountTypeSelect.addEventListener("change", function(event){
    const value = event.target.value
    userData.user_type = value
    signupAccountTypeSelect.value = value
  });

  signupFirstNameInput.addEventListener("keyup", function(event){
    const value = event.target.value;
    signupFirstNameInput.value = value;
  });

  signupLastNameInput.addEventListener("keyup", function(event){
    const value = event.target.value;
    signupLastNameInput.value = value;
  });

  signupUserNameInput.addEventListener("keyup", function(event){
    const value = event.target.value;
    signupUserNameInput.value = value;
  });

  signupEmailInput.addEventListener("keyup", function(event){
    const value = event.target.value;
    signupEmailInput.value = value;
  });

  signupPasswordInput.addEventListener("keyup", function(event){
    const value = event.target.value;
    signupPasswordInput.value = value;
  });

  signupConfirmPasswordInput.addEventListener("keyup", function(event){
    const value = event.target.value;
    signupConfirmPasswordInput.value = value;
  });

  signupSubmitButton.addEventListener("click", function(event){
    event.preventDefault()
    const url = BACKEND_BASE_API + "users/users/"
    if(signupAccountTypeSelect.value === "" || signupFirstNameInput.value ==="" || signupLastNameInput.value ==="" || signupUserNameInput.value ==="" || signupEmailInput.value ==="" || signupPasswordInput.value === "" || signupConfirmPasswordInput.value ===""){
      alert("All fields are required");
      return;
    };

    if(signupPasswordInput.value === signupConfirmPasswordInput.value){
      userData.user_type = signupAccountTypeSelect.value;
      userData.first_name = signupFirstNameInput.value;
      userData.last_name = signupLastNameInput.value;
      userData.username = signupUserNameInput.value;
      userData.email = signupEmailInput.value;
      userData.password = signupPasswordInput.value;
      console.log(userData)
      postAPIData(url, userData)
      .then(response => {
        alert("Successfuly created a new user. Login to continue");
        clearForm();
        openLoginPage()
        return;
      })
      .catch(error => {
        alert(error)
        return;
      })
      return;
    }else{
      alert("Mismatching passwords, please enter a valid password and confirmation password");
      return;
    }
  });
});
