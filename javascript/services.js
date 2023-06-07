const BACKEND_BASE_API = "http://localhost:8000/"

let services_data = {
  categories: [],
  house_calls: false,
  minimum_charge: 0,
}

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

function getAPIData(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          resolve(data); // Resolve the promise with the API response data
        })
        .catch(error => {
          reject(error); // Reject the promise with the error
        });
    });
  }


function loadCategories(){
    const url = BACKEND_BASE_API + "provider_services/categories/";
    getAPIData(url)
    .then(data => {
        const providedCategories = document.getElementById("provided-categories");
        data.forEach(category => {
           const providedCategory = document.createElement('div');
           providedCategory.classList.add('qqqq');
           const spacingDiv = document.createElement('div');
           const categoryLabel = document.createElement('label');
           const labelName = document.createElement('p');
           labelName.textContent = category.category_name;        
           const categoryInput = document.createElement('input');
           categoryInput.type = 'checkbox';
           categoryInput.value = category.id;
           categoryInput.addEventListener("change", function(event){
            const value = event.target.value
            services_data.categories.push(value)
           });

           categoryLabel.appendChild(categoryInput);
           categoryLabel.appendChild(labelName);
           spacingDiv.appendChild(categoryLabel);
           providedCategory.appendChild(spacingDiv);
           providedCategories.appendChild(providedCategory);
        })
    })
    .catch(error => {
        console.warn('Something went wrong.', error);
      // Handle any errors that occur during the API request
    });
};

document.addEventListener("DOMContentLoaded", function() {
    loadCategories();
    const houseYesCallsEntry = document.getElementById("house-calls-yes-entry");
    houseYesCallsEntry.addEventListener("change", function(event){
      services_data.house_calls = true;
    });

    const houseNoCallsEntry = document.getElementById("house-calls-no-entry");
    houseNoCallsEntry.addEventListener("change", function(event){
      services_data.house_calls = false;
    });

    const minimumCharge = document.getElementById("minimum-charge");
    minimumCharge.addEventListener("keyup", function(event){
      const value = event.target.value;
      services_data.minimum_charge = value;
      console.log("Services data returned", services_data)
    });

    const servicesNextBtn = document.getElementById("services-next-btn");
    servicesNextBtn.addEventListener("click", function(){
      localStorage.setItem("portfolio", JSON.stringify(services_data))
      var x = JSON.parse(localStorage.getItem("portfolio"));
    });
});
