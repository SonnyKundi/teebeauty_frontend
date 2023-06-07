const BACKEND_BASE_API = "http://localhost:8000/";

function getAPIData(url, token) {
    return new Promise((resolve, reject) => {
      fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `JWT ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
          resolve(data); // Resolve the promise with the API response data
        })
        .catch(error => {
          reject(error); // Reject the promise with the error
        });
    });
};

//show navbar
const nav = document.querySelector('.nav-menu');
const toggle = document.querySelector('.nav-toggle');
toggle.onclick = function(){
    nav.classList.toggle('show-nav')
}


//remove navbar

const navLink = document.querySelectorAll('.nav-link')

function linkAction(){
    const navMenu = document.querySelector('.nav-menu')
    navMenu.classList.remove('show-nav')
}

navLink.forEach(n => n.addEventListener('click', linkAction))

//change active color

const linkColor = document.querySelectorAll('.nav-link')
function colorLink(){
    if (linkColor) {
        linkColor.forEach(L => L.classList.remove('active'))
        this.classList.add('active')
    }
}
linkColor.forEach(L => L.addEventListener('click', colorLink))

//Change Header Background when scrolling down

function scrollHeader(){
    const scrollHeader = document.getElementById('header')
    if(this.scrollY >= 200){
        scrollHeader.classList.add('scroll-header')
    }
    else{
        scrollHeader.classList.remove('scroll-header')
    }
}
window.addEventListener('scroll', scrollHeader);

document.addEventListener("DOMContentLoaded", function(event){
    event.preventDefault()
    var token = JSON.parse(localStorage.getItem("tersunToken"));
    if(token !== null){
        accessToken = token.access
        const url = BACKEND_BASE_API + "users/me/"
        console.log("The url is ", url, " and the token is ", accessToken)

        getAPIData(url, accessToken)
        .then(data => {
            if(data.id === undefined){
                return;
            };
            console.log("Home user is: ", data.id);
            localStorage.setItem("tersunUser", JSON.stringify(data));
            var user = JSON.parse(localStorage.getItem("tersunUser"));
            console.log("THe user from the local storage is ", user);
            const indexPortfolioLink = document.getElementById("index-portfolio-link");
            const indexPaymentsLink = document.getElementById("index-payments-link");
            const indexProvidersLink = document.getElementById("index-providers-link");
            const indexUser = document.getElementById("index-user");
            indexUser.addEventListener("click", function(){
                window.location.href = "activity.html";
            });
            const greeting = document.createElement("p");
            greeting.textContent = "Welcome,";
            const name = document.createElement("a");
            name.textContent = data.full_name;
            name.classList.add("nav-link");
            indexUser.appendChild(greeting);
            indexUser.appendChild(name);
            indexUser.removeAttribute("hidden");
            if(data.user_type === "PROVIDER" || data.user_type === "ADMIN"){
                indexPortfolioLink.removeAttribute("hidden");
            };
            if(data.user_type === "ADMIN"){
                indexPaymentsLink.removeAttribute("hidden");
                indexProvidersLink.removeAttribute("hidden");
            }
            console.log("The logged in user is ", data);
        })
        .catch(error => {
            alert(error);
        });
    };
});
