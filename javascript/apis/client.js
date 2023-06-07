export const BACKEND_BASE_API = "http://localhost:8000/";
let filters = []

export function getAPIData(url) {
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

function handleCategorySelect(event) {
  const selectedOption = event.target.value;
  const query = {
    field: "category",
    value: selectedOption
  };
  const filterChecker = filters.find(
    (filter) => filter.field === "category"
  );
  if(filterChecker !== undefined){
    filters = filters.filter((filter) => filter.field !== "category");
  };
  filters.push(query);
  loadServices({filters: filters});
};

function handleTownSelect(event) {
  const selectedOption = event.target.value;
  const query = {
    field: "town",
    value: selectedOption
  };
  const filterChecker = filters.find(
    (filter) => filter.field === "town"
  );
  if(filterChecker !== undefined){
    filters = filters.filter((filter) => filter.field !== "town");
  };
  filters.push(query);
  loadServices({filters: filters});
};

function loadCategories() {
  const url = BACKEND_BASE_API + "provider_services/categories/";
  getAPIData(url)
    .then(data => {
      const selectElement = document.getElementById('client-category-selection');
      const defaultOption = document.createElement('option');
      defaultOption.textContent = 'Select a category';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      selectElement.appendChild(defaultOption);
      selectElement.addEventListener('change', handleCategorySelect);
      data.forEach(category => {
        const optionElement = document.createElement('option');
        optionElement.value = category.category_name;
        optionElement.textContent = category.category_name;
        selectElement.appendChild(optionElement);
      });
    })
    .catch(error => {
      console.warn('Something went wrong.', error);
      // Handle any errors that occur during the API request
    });
}

function loadTowns(){
    const url = BACKEND_BASE_API + "provider_services/towns/";
    getAPIData(url)
    .then(data => {
        const clientCitiesElement = document.getElementById('client-cities');
        clientCitiesElement.addEventListener('change', handleTownSelect);
        data.forEach(town => {
            const townOption = document.createElement('option');
            townOption.value = town.town_name;
            townOption.textContent = town.town_name;
            clientCitiesElement.appendChild(townOption);
        });
    })
    .catch(error => {
        console.warn('Something went wrong.', error);
        // Handle any errors that occur during the API request
      });
}

document.addEventListener("DOMContentLoaded", function() {
    loadCategories();   
    loadTowns();  
    loadServices(); 
  });

function loadServices(props){
  let url = BACKEND_BASE_API + "provider_services/services/";
  if (props?.filters !== undefined){
    url = url + "?"
    for (let index=0; index<props.filters?.length; index++){
      const filter = props.filters[index]
      if(index>=1){
        url = url + `&&${filter.field}=${filter.value}`
      }
      else{
        url = url + `${filter.field}=${filter.value}`
      };
    }
  };

  getAPIData(url)
  .then(data => {
      const portfolioServices = document.getElementById('artist-portfolios');
      portfolioServices.innerHTML = '';
      data.forEach(service => {
          const portfolio = document.createElement('div');
          portfolio.classList.add('portfolio1');
          const portfolioImage = document.createElement('div');
          portfolioImage.classList.add('image1');
          const portfolioImageAtag = document.createElement('a');
          portfolioImageAtag.classList.add('inline-block-display');
          portfolioImageAtag.addEventListener('click', function() {
            const id=service.id
            const url = '/artist.html?id=' + encodeURIComponent(id);
            window.open(url, '_self');
          });
          const portfolioImageImg = document.createElement('img');
          portfolioImageImg.src = service.billboard_image;
          portfolioImageImg.height = "20";
          portfolioImageImg.width = "20";

          const portfolioInfo = document.createElement("div");
          portfolioInfo.classList.add("info");

          const portfolioProfileServices = document.createElement("div");
          portfolioProfileServices.classList.add("services");

          const portfolioProfileService = document.createElement("div");
          portfolioProfileService.classList.add("service");

          service.categories.forEach(category => {
            const portfolioProfileServiceCategory = document.createElement("div");
            portfolioProfileServiceCategory.textContent = category;
            portfolioProfileService.appendChild(portfolioProfileServiceCategory);
          })

          const portfolioProfileIcon = document.createElement("div");
          portfolioProfileIcon.classList.add("icon");

          const portfolioProfileIconImg = document.createElement('img');
          portfolioProfileIconImg.src = "../../images/heart-empty.svg";
          portfolioProfileIconImg.height = "18";
          portfolioProfileIconImg.width = "18";

          portfolioProfileIcon.appendChild(portfolioProfileIconImg);

          portfolioProfileServices.appendChild(portfolioProfileService);
          portfolioProfileServices.appendChild(portfolioProfileIcon);

          const portfolioProfileInfo = document.createElement("div");
          portfolioProfileInfo.classList.add("info1");

          const portfolioProfileInfoProfile = document.createElement("div");
          portfolioProfileInfoProfile.classList.add("profile");

          const portfolioProfileInfoProfileImage = document.createElement("div");
          const portfolioProfileInfoProfileImageImg = document.createElement("img");
          portfolioProfileInfoProfileImageImg.src=service.billboard_image;

          portfolioProfileInfoProfileImage.appendChild(portfolioProfileInfoProfileImageImg);
          portfolioProfileInfoProfile.appendChild(portfolioProfileInfoProfileImage);

          const portfolioProfileInfoProfileDetails = document.createElement("div");
          const portfolioProfileInfoProfileDetailsHeading = document.createElement("h4");
          portfolioProfileInfoProfileDetailsHeading.textContent="by ";

          const portfolioProfileInfoProfileProvider=document.createElement("span");
          portfolioProfileInfoProfileProvider.textContent=service.provider_name;
          portfolioProfileInfoProfileDetailsHeading.appendChild(portfolioProfileInfoProfileProvider);

          const portfolioProfileInfoProfileStar = document.createElement("div");
          portfolioProfileInfoProfileStar.classList.add("star");

          const portfolioProfileInfoProfileStarImg = document.createElement("img");
          portfolioProfileInfoProfileStarImg.src = "../../images/star.svg";

          const portfolioProfileInfoProfileStarRating = document.createElement("span");
          portfolioProfileInfoProfileStarRating.textContent=service.average_ratings.rating.toFixed(2);

          const portfolioProfileInfoProfileStarCount = document.createElement("span");
          portfolioProfileInfoProfileStarCount.textContent=`(${service.average_ratings.count})`;

          portfolioProfileInfoProfileStar.appendChild(portfolioProfileInfoProfileStarImg);
          portfolioProfileInfoProfileStar.appendChild(portfolioProfileInfoProfileStarRating);
          portfolioProfileInfoProfileStar.appendChild(portfolioProfileInfoProfileStarCount);

          portfolioProfileInfoProfileDetails.appendChild(portfolioProfileInfoProfileDetailsHeading);
          portfolioProfileInfoProfileDetails.appendChild(portfolioProfileInfoProfileStar);
          service.locations.forEach(location => {
            const portfolioProfileInfoLocation = document.createElement("span");
            portfolioProfileInfoLocation.textContent=location;
            portfolioProfileInfoProfileDetails.appendChild(portfolioProfileInfoLocation);
          });

          portfolioProfileInfoProfile.appendChild(portfolioProfileInfoProfileDetails);

          const portfolioProfileInfoRates = document.createElement("div");
          portfolioProfileInfoRates.classList.add("rates");

          const portfolioProfileInfoRatesHeading = document.createElement("h5");
          portfolioProfileInfoRatesHeading.textContent="from ";

          const portfolioProfileInfoRatesAmount = document.createElement("span");
          portfolioProfileInfoRatesAmount.classList.add("money");
          portfolioProfileInfoRatesAmount.textContent="KSH"+ parseInt(service.minimum_charge);

          portfolioProfileInfoRatesHeading.appendChild(portfolioProfileInfoRatesAmount);
          portfolioProfileInfoRates.appendChild(portfolioProfileInfoRatesHeading);

          portfolioProfileInfo.appendChild(portfolioProfileInfoProfile);
          portfolioProfileInfo.appendChild(portfolioProfileInfoRates);

          portfolioImageAtag.appendChild(portfolioImageImg);
          portfolioImage.appendChild(portfolioImageAtag);
          portfolio.appendChild(portfolioImage);

          portfolioInfo.appendChild(portfolioProfileServices)
          portfolioInfo.appendChild(portfolioProfileInfo)
          portfolio.appendChild(portfolioInfo);
          portfolioServices.appendChild(portfolio);
      })
    })
    .catch(error => {
        console.warn('Something went wrong.', error);
        // Handle any errors that occur during the API request
      });
}

function filterByRating(rating){
  const query = {
    field: "average_rating",
    value: rating
  };
  const filterChecker = filters.find(
    (filter) => filter.field === "average_rating"
  );
  if(filterChecker !== undefined){
    filters = filters.filter((filter) => filter.field !== "average_rating");
  };
  filters.push(query);
  loadServices({filters: filters});
};

const ratingsFilterR1 = document.getElementById("r1");
ratingsFilterR1.addEventListener("click", function(event) {
  const selectedRating = event.target.value;
  filterByRating(selectedRating);
});

const ratingsFilterR2 = document.getElementById("r2");
ratingsFilterR2.addEventListener("click", function(event) {
  const selectedRating = event.target.value;
  filterByRating(selectedRating);
});

const ratingsFilterR3 = document.getElementById("r3");
ratingsFilterR3.addEventListener("click", function(event) {
  const selectedRating = event.target.value;
  filterByRating(selectedRating);
});

const ratingsFilterR4 = document.getElementById("r4");
ratingsFilterR4.addEventListener("click", function(event) {
  const selectedRating = event.target.value;
  filterByRating(selectedRating);
});

const ratingsFilterR5 = document.getElementById("r5");
ratingsFilterR5.addEventListener("click", function(event) {
  const selectedRating = event.target.value;
  filterByRating(selectedRating);
});

function filterServices(){
  loadServices({filters: filters});
};

const applyButton = document.getElementById("filter-apply-button");
applyButton.addEventListener("click", filterServices);

const housecallCheck = document.getElementById("yes")
housecallCheck.addEventListener("change", function(event) {
  const checkValue = event.target.checked;
  const query = {
    field: "house_calls",
    value: checkValue
  };
  const filterChecker = filters.find(
    (filter) => filter.field === "house_calls"
  );
  if(filterChecker !== undefined){
    filters = filters.filter((filter) => filter.field !== "house_calls");
  };
  filters.push(query);
  loadServices({filters: filters});
});
