//show navbar
const BACKEND_BASE_API = "http://localhost:8000/";

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
        .then(responseData => {
          resolve(responseData); // Resolve the promise with the response data
        })
        .catch(error => {
          reject(error);
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const providerId = params.get('id');
    let data = {
      created_by: "85ca1206-4461-4924-a78a-8854b5c5e450",
      updated_by: "85ca1206-4461-4924-a78a-8854b5c5e450",
      provider: providerId,
      email: "",
      phone_number: "",
      whatsapp_number: "",
      twitter_link: "",
      instagram_link: "",
      facebook_link: "",
      tiktok_link: "",
      youtube_link: "",
      website_link: "",
    };

    const phoneNumberElem = document.getElementById("phone-number-field");
    phoneNumberElem.addEventListener("keyup", function(event){
        const value = event.target.value;
        data.phone_number = value
    });

    const whatsappNumberElem = document.getElementById("whatsapp-number-field");
    whatsappNumberElem.addEventListener("keyup", function(event){
        const value = event.target.value;
        data.whatsapp_number = value
    });

    const emailElement = document.getElementById("business-email-field");
    emailElement.addEventListener("keyup", function(event){
        const value = event.target.value;
        data.email = value
    });

    const twitterElement = document.getElementById("twitter-business-field");
    twitterElement.addEventListener("keyup", function(event){
        const value = event.target.value;
        data.twitter_link = value
    });

    const instagramElement = document.getElementById("instagram-business-field");
    instagramElement.addEventListener("keyup", function(event){
        const value = event.target.value;
        data.instagram_link = value
    });

    const facebookElement = document.getElementById("facebook-business-field");
    facebookElement.addEventListener("keyup", function(event){
        const value = event.target.value;
        data.facebook_link = value
    });

    const tiktokElement = document.getElementById("tiktok-business-field");
    tiktokElement.addEventListener("keyup", function(event){
        const value = event.target.value;
        data.tiktok_link = value
    });

    const youtubeElement = document.getElementById("youtube-business-field");
    youtubeElement.addEventListener("keyup", function(event){
        const value = event.target.value;
        data.youtube_link = value
    });

    const websiteElement = document.getElementById("website-business-field");
    websiteElement.addEventListener("keyup", function(event){
        const value = event.target.value;
        data.website_link = value
    });

    const finishButton = document.getElementById("finish-button");
    finishButton.addEventListener("click", function(){
      const url = BACKEND_BASE_API + `providers/provider_contacts/`
      postAPIData(url, data)
        .then(response => {
          const url = `index.html`;
          window.open(url, '_self');
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
});
