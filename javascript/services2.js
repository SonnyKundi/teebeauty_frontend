const BACKEND_BASE_API = "http://localhost:8000/";

let services_data = {
    categories: [],
    house_calls: false,
    minimum_charge: 0,
};

let profile_image = "";
let billboard_image = "";

let profile = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    town: "",
    description: "",
    images: [],
}

function postAPIData(url, data) {
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
    })
    .then(responseData => {
      console.log(responseData);
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

function postAPIFormData(url, formData) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      body: formData
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
}

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
};


function handleTownSelect(event){
    id = event.target.value
    profile.town = id
};

function loadTowns(){
    const url = BACKEND_BASE_API + "provider_services/towns/";
    getAPIData(url)
    .then(data => {
        const clientCitiesElement = document.getElementById('service-towns');
        clientCitiesElement.addEventListener('change', handleTownSelect);
        data.forEach(town => {
            const townOption = document.createElement('option');
            townOption.value = town.id;
            townOption.textContent = `${town.town_name + ", " + town.county}`;
            clientCitiesElement.appendChild(townOption);
        });
    })
    .catch(error => {
        console.warn('Something went wrong.', error);
        // Handle any errors that occur during the API request
      });
};

function submitService(data){
    const url = BACKEND_BASE_API + "provider_services/services/new_service/";
    const formData = new FormData();

    var images = data.profile.images
    for (i=0; i<images.length; i++){
        formData.append('images', images[i]);
    };

    formData.append('username', data.profile.username);
    formData.append('first_name', data.profile.first_name);
    formData.append('last_name', data.profile.last_name);
    formData.append('email', data.profile.email);
    formData.append('phone_number', data.profile.phone_number);
    formData.append('towns', data.profile.town);
    formData.append('description', data.profile.description);
    formData.append('categories', data.services_data.categories);
    formData.append('house_calls', data.services_data.house_calls);
    formData.append('minimum_charge', data.services_data.minimum_charge);
    formData.append('profile_image', data.profile_image);
    formData.append('billboard_image', data.billboard_image);

    postAPIFormData(url, formData)
    .then(data => {
      if(data !== undefined){
        localStorage.setItem("new_service", JSON.stringify(profile))
        const id=data.provider
        const url = 'services3.html?id=' + encodeURIComponent(id);
        window.open(url, '_self');
      }
    })
    .catch(err => {
      alert(err);
      console.log('Something went wrong.', err)
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

document.addEventListener("DOMContentLoaded", function() {
    loadTowns()
    var portfolioData = JSON.parse(localStorage.getItem("portfolio"));
    services_data=portfolioData
    console.log("Accepted Json Parsed portfolio data is ", services_data);

    var userName = document.getElementById("user-name")
    userName.addEventListener("keyup", function(event){
        const value = event.target.value;
        profile.username=value;
    });

    var description = document.getElementById("profile-description");
    description.addEventListener("keyup", function(event){
        const value = event.target.value;
        profile.description=value;
    });

    const profileFirstName = document.getElementById("profile-first-name");
    profileFirstName.addEventListener("keyup", function(event){
        const value = event.target.value;
        profile.first_name=value;
    });

    const profileLastName = document.getElementById("profile-last-name");
    profileLastName.addEventListener("keyup", function(event){
        const value = event.target.value;
        profile.last_name=value;
    });

    const profileEmail = document.getElementById("profile-email");
    profileEmail.addEventListener("keyup", function(event){
        const value = event.target.value;
        profile.email=value;
    });

    const profilePhoneNumber = document.getElementById("profile-phone-number");
    profilePhoneNumber.addEventListener("keyup", function(event){
        const value = event.target.value;
        profile.phone_number=value;
    });

    const profieImageChange = document.getElementById("profie-image-change");
    profieImageChange.addEventListener("change", function(event){
        const value = profieImageChange.files[0];
        profile_image = value;
        console.log(profile_image);
    });

    const billboardImageChange = document.getElementById("billboard-image-change");
    billboardImageChange.addEventListener("change", function(event){
        const value = billboardImageChange.files[0];
        billboard_image = value;
        console.log(billboard_image);
    });

    const servicePhotos = document.getElementById("service-photos");
    servicePhotos.addEventListener("change", function(event){
        const selectedFiles = Array.from(servicePhotos.files);
        profile.images = selectedFiles;
    });

    const personalDetailsNext = document.getElementById("personal-details-next");
    personalDetailsNext.addEventListener("click", function(){
        console.log("Image has ", profile.profile_image)
        const data = {profile: profile, services_data:services_data, profile_image: profile_image, billboard_image: billboard_image}
        console.log(data);
        submitService(data);
        localStorage.setItem("personalDetails", JSON.stringify(data))
        var x = JSON.parse(localStorage.getItem("personalDetails"));
    });
});
