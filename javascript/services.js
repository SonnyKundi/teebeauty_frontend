const BACKEND_BASE_API = "http://localhost:8000/"

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
           categoryInput.value = category.category_name;
        //    console.log(category.category_name);

           categoryLabel.appendChild(categoryInput);
           categoryLabel.appendChild(labelName);
           spacingDiv.appendChild(categoryLabel);
           providedCategory.appendChild(spacingDiv);
           providedCategories.appendChild(providedCategory);
        //    console.log(providedCategory);
        })
        console.log("Load Categories data is ", data);
    })
    .catch(error => {
        console.warn('Something went wrong.', error);
      // Handle any errors that occur during the API request
    });
};

document.addEventListener("DOMContentLoaded", function() {   
    loadCategories();   
});