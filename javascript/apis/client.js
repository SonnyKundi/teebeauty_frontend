export const BACKEND_BASE_API = "http://localhost:8000/";

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

function loadCategories() {
  const url = BACKEND_BASE_API + "provider_services/categories/";
  getAPIData(url)
    .then(data => {
      const selectElement = document.getElementById('client-category-selection');
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

function loadServices(){
    const url = BACKEND_BASE_API + "provider_services/services/";
    getAPIData(url)
    .then(data => {
        console.log("Load Services data ", data);
        const portfolioServices = document.getElementById('artist-portfolios');
        data.forEach(service => {
            const portfolio = document.createElement('div');
            portfolio.classList.add('portfolio1');
            const portfolioImage = document.createElement('div');
            portfolioImage.classList.add('image1');
            const portfolioImageAtag = document.createElement('a');
            portfolioImageAtag.classList.add('inline-block-display');
            const portfolioImageImg = document.createElement('img');
            portfolioImageImg.src = service.billboard_image;
            portfolioImageImg.height = "20";
            portfolioImageImg.width = "20";

            portfolioImageAtag.appendChild(portfolioImageImg);
            portfolioImage.appendChild(portfolioImageAtag);
            portfolio.appendChild(portfolioImage);
            portfolioServices.appendChild(portfolio);
        })
        
    })
    .catch(error => {
        console.warn('Something went wrong.', error);
        // Handle any errors that occur during the API request
      });
}