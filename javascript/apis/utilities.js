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

