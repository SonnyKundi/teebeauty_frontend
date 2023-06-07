export const BACKEND_BASE_API = "http://localhost:8000/";
let ratingsData = {};
let requestData = {
  service: "",
  phone_number: "",
  whatsapp_number:"",
  email:"",
};

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

function reloadRatings(id){
  const url = BACKEND_BASE_API + "provider_services/services/" + `${id}`;
  getAPIData(url)
    .then(data => {
      const averageRating = document.getElementById("average-rating");
      const rating=data.average_ratings.rating
      averageRating.textContent=rating.toFixed(2);

      const averageRatingCount = document.getElementById("average-rating-count");
      averageRatingCount.textContent=`(${data.average_ratings.count})`;
    })
    .catch(error => {
      console.warn('Something went wrong.', error);
    });
};

function resetStar(activeStar){
  const oneStar = document.getElementById("one-star")
  const twoStar = document.getElementById("two-star")
  const threeStar = document.getElementById("three-star")
  const fourStar = document.getElementById("four-star")
  const fiveStar = document.getElementById("five-star")

  const allStars = [oneStar, twoStar, threeStar, fourStar, fiveStar]

  for (let i=0; i<=4; i++){
    if (allStars[i] === activeStar){
      continue
    }
    allStars[i].style.width="20px"
  }
}

document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const idValue = params.get('id');
    loadService(idValue);

    const oneStar = document.getElementById("one-star")
    oneStar.addEventListener("click", function(){
      ratingsData.rating = 1;
      oneStar.style.width="35px"
      resetStar(oneStar)
    });

    const twoStar = document.getElementById("two-star")
    twoStar.addEventListener("click", function(){
      ratingsData.rating = 2;
      twoStar.style.width="35px"
      resetStar(twoStar)
    });

    const threeStar = document.getElementById("three-star")
    threeStar.addEventListener("click", function(){
      ratingsData.rating = 3;
      threeStar.style.width="35px"
      resetStar(threeStar)
    });

    const fourStar = document.getElementById("four-star")
    fourStar.addEventListener("click", function(){
      ratingsData.rating = 4;
      fourStar.style.width="35px"
      resetStar(fourStar)
    });

    const fiveStar = document.getElementById("five-star")
    fiveStar.addEventListener("click", function(){
      ratingsData.rating = 5;
      fiveStar.style.width="35px"
      resetStar(fiveStar)
    });

    const closeRatingPopup = document.getElementById("close-rating-popup");
    const newRatingForm = document.getElementById("new-rating-form");

    closeRatingPopup.addEventListener("click", function() {
      newRatingForm.style.display = 'none';
      newRatingForm.style.visibility = 'hidden';
      newRatingForm.classList.add('hide-popup');
    });

    const ratingComment = document.getElementById("rating-comment");
    ratingComment.addEventListener("keyup", function(event){
      const value = event.target.value;
      ratingsData.comment = value;
    });

    const submitRating = document.getElementById("submit-rating")
    submitRating.addEventListener("click", function(){
      ratingsData.created_by="85ca1206-4461-4924-a78a-8854b5c5e450"
      ratingsData.updated_by="85ca1206-4461-4924-a78a-8854b5c5e450"
      ratingsData.service=idValue
      const url = BACKEND_BASE_API + "provider_services/ratings/";
      postAPIData(url, ratingsData)
      newRatingForm.style.display = 'none';
      newRatingForm.style.visibility = 'hidden';
      newRatingForm.classList.add('hide-popup');
      reloadRatings(idValue)
    });
});

function loadService(id){
    const url = BACKEND_BASE_API + "provider_services/services/" + `${id}/`;
    getAPIData(url)
      .then(data => {
        document.title=data.service_name;
        const providerNameBreadCrumb = document.getElementById("bread-provider-name");
        providerNameBreadCrumb.textContent=data.provider_name;

        const providerName = document.getElementById("provider-name");
        providerName.textContent=data.provider_name;

        const billboardImage = document.getElementById("billboard-image")
        billboardImage.src=data.billboard_image

        const profileImage = document.getElementById("profile-image")
        profileImage.src=data.profile_image

        const userName = document.getElementById("username");
        userName.textContent="@"+data.username;

        const averageRating = document.getElementById("average-rating");
        const rating=data.average_ratings.rating
        averageRating.textContent=rating.toFixed(2);

        const averageRatingCount = document.getElementById("average-rating-count");
        averageRatingCount.textContent=`(${data.average_ratings.count})`;

        const serviceLocations = document.getElementById("service-locations")
        serviceLocations.classList.add("vertical-display")
        data.locations.forEach(location => {
          const locationElement = document.createElement("div")

          const locationIcon = document.createElement("img")
          locationIcon.src="../../images/location-point.svg"
          locationIcon.height="12"
          locationIcon.width="12"
          locationElement.appendChild(locationIcon)

          const locationName = document.createElement("span")
          locationName.textContent=` ${location}`
          locationElement.appendChild(locationName)
          serviceLocations.appendChild(locationElement)
        });

        const starRatings = document.getElementById("star-ratings")
        const averageStarRatings = document.getElementById("average-star-ratings");

        let fullStars = parseInt(data.average_ratings.rating)
        if (fullStars >= 5){
          fullStars = 5
        }
        for (let i=1; i<=fullStars; i++){
          const star = document.createElement("img");
          star.src="../../images/star.svg"
          starRatings.appendChild(star)

          const avgStar = document.createElement("img");
          avgStar.src="../../images/star.svg"
          averageStarRatings.appendChild(avgStar)
        }
        if(fullStars < 5){
          const emptyStars = 5 - fullStars
          for (let i=1; i<=emptyStars; i++){
            const star = document.createElement("img");
            star.src="../../images/star-empty.svg"
            starRatings.appendChild(star)

            const avgStar = document.createElement("img");
            avgStar.src="../../images/star-empty.svg"
            averageStarRatings.appendChild(avgStar)
          }
        }

        const description = document.getElementById("service-description");
        description.textContent=data.description;

        const minimumChargeAmount = document.getElementById("minimum-charge-amount");
        minimumChargeAmount.textContent = `KSH ${data.minimum_charge}`;

        const houseCallCheck = document.getElementById("house-call-check");
        houseCallCheck.textContent=`${data.house_calls? "YES": "NO"}`;

        const providerProfileImages = document.getElementById("provider-profile-images");

        data.images.forEach(image  => {
          const profileImage = document.createElement("div");
          profileImage.classList.add("gett1");

          const profileImageImg = document.createElement("img");
          profileImageImg.src = BACKEND_BASE_API + image.image;
          profileImageImg.height = "155";

          profileImage.appendChild(profileImageImg);
          providerProfileImages.appendChild(profileImage);
        });

        const subCategories = document.getElementById("profile-sub-categories");
        data.sub_categories.forEach(sub_category => {
          const subCategory =document.createElement("div");
          subCategory.textContent=sub_category.sub_category_name;
          subCategories.appendChild(subCategory);
        });

        const newRating = document.getElementById("new-rating");
        newRating.addEventListener("click", function() {
          const newRatingForm = document.getElementById("new-rating-form");
          newRatingForm.classList.add('show');
        });

        const phoneNumberHref = document.getElementById("phone-number-href");
        phoneNumberHref.setAttribute("href", `${data.contacts?.phone_number || ""}`);

        const phoneNumberDisplay = document.getElementById("phone-number-display");
        phoneNumberDisplay.textContent=data.contacts?.phone_number || "";

        const emailHref = document.getElementById("email-href");
        emailHref.setAttribute("href", `${data.contacts?.email || ""}`);

        const emailDisplay = document.getElementById("email-display");
        emailDisplay.textContent=data.contacts?.email || "";

        const twitterHref = document.getElementById("twitter-href");
        twitterHref.setAttribute("href", `${data.contacts?.twitter_link || ""}`);

        const facebookHref = document.getElementById("facebook-href");
        facebookHref.setAttribute("href", `${data.contacts?.facebook_link || ""}`);

        const youtubeHref = document.getElementById("youtube-href");
        youtubeHref.setAttribute("href", `${data.contacts?.youtube_link || ""}`);

        const instagramHref = document.getElementById("instagram-href");
        instagramHref.setAttribute("href", `${data.contacts?.instagram_link || ""}`);

        const whatsappHref = document.getElementById("whatsapp-href");
        whatsappHref.setAttribute("href", `${data.contacts?.whatsapp_number || ""}`);

        const requestServiceButton = document.getElementById("request-service-button");
        const requestService = document.getElementById("request-service");
        requestServiceButton.addEventListener("click", function(){
          requestData.service = id;
          var user = JSON.parse(localStorage.getItem("tersunUser"));
          console.log("THe user from the local storage is ", user);
          if(user === null){
            window.location.href = "login.html";
            return;
          };
          requestData.created_by = user.id;
          requestData.updated_by = user.id;

          const popup = document.createElement("div");
          popup.classList.add("popup");
          popup.classList.add("show");

          const modalContent = document.createElement("div");
          modalContent.classList.add("modal-content");

          const close = document.createElement("span");
          close.classList.add("close");
          const closeBtn = document.createElement("i");
          closeBtn.classList.add("fa");
          closeBtn.classList.add("fa-times");
          closeBtn.setAttribute("aria-hidden", true);
          closeBtn.addEventListener("click", function() {
            popup.style.display = "none";
          });

          close.appendChild(closeBtn);

          modalContent.appendChild(close);

          const heading = document.createElement("h2");
          heading.textContent="Request Service";

          const message = document.createElement("p");
          message.textContent="Please enter your contact details";

          const contactForm = document.createElement("form")
          const contactEmail = document.createElement("div")
          const contactEmailLabel = document.createElement("label")
          contactEmailLabel.textContent="Email:"
          const contactEmailInput = document.createElement("input")
          contactEmailInput.classList.add("input")
          contactEmailInput.setAttribute("placeholder", "Enter your personal email address");
          contactEmailInput.addEventListener("keyup", function(event){
            const value = event.target.value;
            requestData.email = value;
          });

          contactEmail.appendChild(contactEmailLabel);
          contactEmail.appendChild(contactEmailInput);
          contactForm.appendChild(contactEmail);

          const contactPhone = document.createElement("div");
          const contactPhoneLabel = document.createElement("label");
          contactPhoneLabel.textContent="Phone:";
          const contactPhoneInput = document.createElement("input");
          contactPhoneInput.classList.add("input");
          contactPhoneInput.setAttribute("placeholder", "Enter your personal phone number");
          contactPhoneInput.addEventListener("keyup", function(event){
            const value = event.target.value;
            requestData.phone_number = value;
          });

          contactPhone.appendChild(contactPhoneLabel);
          contactPhone.appendChild(contactPhoneInput);
          contactForm.appendChild(contactPhone);

          const contactWhatsapp = document.createElement("div");
          const contactWhatsappLabel = document.createElement("label");
          contactWhatsappLabel.textContent="Whatsapp:";
          const contactWhatsappInput = document.createElement("input");
          contactWhatsappInput.classList.add("input");
          contactWhatsappInput.setAttribute("placeholder", "Enter your whatsapp number");
          contactWhatsappInput.addEventListener("keyup", function(event){
            const value = event.target.value;
            requestData.whatsapp_number = value;
          });

          contactWhatsapp.appendChild(contactWhatsappLabel);
          contactWhatsapp.appendChild(contactWhatsappInput);
          contactForm.appendChild(contactWhatsapp);

          const submit = document.createElement("div");
          submit.classList.add("centered");
          const submitBtn = document.createElement("button");
          submitBtn.addEventListener("click", function(event){
            event.preventDefault();
            if(requestData.email === ""){
              alert("Email field is required");
            };
            if(requestData.phone_number === ""){
              alert("Phone number field is required");
            };
            const url = BACKEND_BASE_API + "appointments/bookings/"
            postAPIData(url, requestData)
            .then(data => {
              alert("Successfuly booked an appointment");
              contactEmailInput.value = "";
              contactPhoneInput.value = "";
              contactWhatsappInput.value = "";
              popup.style.display = "none";
            })
            .catch(error => {
              alert(error)
            });
          });
          submitBtn.classList.add("btn");
          submitBtn.textContent="Submit";

          submit.appendChild(submitBtn);
          contactForm.appendChild(submit);

          modalContent.appendChild(heading);
          modalContent.appendChild(message);
          modalContent.appendChild(contactForm);
          popup.appendChild(modalContent);
          requestService.appendChild(popup);

          console.log("requestServiceButton button clicked");
        });
      })
      .catch(error => {
        console.warn('Something went wrong.', error);
      });
};

const closeRatingPopup = document.getElementById("close-rating-popup");
const newRatingForm = document.getElementById("new-rating-form");

closeRatingPopup.addEventListener("click", function() {
  newRatingForm.style.display = 'none';
  newRatingForm.style.visibility = 'hidden';
  newRatingForm.classList.add('hide-popup');
});
