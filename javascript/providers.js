const BACKEND_BASE_API = "http://localhost:8000/";
let providerData = {
    created_by: "85ca1206-4461-4924-a78a-8854b5c5e450",
    updated_by: "85ca1206-4461-4924-a78a-8854b5c5e450",
    title: "",
    first_name: "",
    last_name: "",
    other_names: "",
    email: "",
    phone_number: "",
    date_of_birth: null,
    gender: null,
    join_date: null,
    username: "",
    profile_image: null
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

function populateTable(data){
    const providersTableData = document.getElementById("providers-table-data");
    providersTableData.innerHTML=``;
    count = 1
    data.forEach(provider => {
        const tableRecord = document.createElement("tr");
        const serialNumber = document.createElement("td");
        serialNumber.textContent= count;
        count ++;
        tableRecord.appendChild(serialNumber);

        const name = document.createElement("td");
        name.textContent= provider.full_name;
        tableRecord.appendChild(name);

        const email = document.createElement("td");
        email.textContent= provider.email;
        tableRecord.appendChild(email);

        const phoneNumber = document.createElement("td");
        phoneNumber.textContent= provider.phone_number;
        tableRecord.appendChild(phoneNumber);

        const whatsappNumber = document.createElement("td");
        whatsappNumber.textContent= provider.whatsapp_number;
        tableRecord.appendChild(whatsappNumber);

        const status = document.createElement("td");
        status.textContent= provider.status;
        tableRecord.appendChild(status);

        const amountDue = document.createElement("td");
        amountDue.textContent= provider.amount_due;
        tableRecord.appendChild(amountDue);

        const actionsOptions = document.createElement("div")
        actionsOptions.classList.add("multi-table-buttons")

        const view = document.createElement("button");
        view.textContent= "VIEW";
        view.classList.add("btnn");

        // actionsOptions.appendChild(view)

        const activate = document.createElement("button");
        activate.textContent= "ACTIVATE";
        activate.classList.add("btnn");
        if(provider.is_active === true){
            activate.textContent= "DEACTIVATE";
            activate.style.backgroundColor="rgb(85, 139, 85)";
        }
        else{
            activate.style.backgroundColor="rgb(223, 13, 13)";
        }

        actionsOptions.appendChild(activate);

        tableRecord.appendChild(actionsOptions);

        providersTableData.appendChild(tableRecord);
    });
};

function reloadProviders(url){
    getAPIData(url)
    .then(data => {
        populateTable(data)
    })
    .catch(err => {
        alert(err)
    });
}

const usernameInput = document.getElementById("username-input");
const firstNameInput = document.getElementById("first-name-input");
const lastNameInput = document.getElementById("last-name-input");
const otherNamesInput = document.getElementById("other-names-input");
const emailInput = document.getElementById("email-input");
const phoneNumberInput = document.getElementById("phone-number-input");

document.addEventListener("DOMContentLoaded", function(event){
    const numericInput = document.getElementById("phone-number-input");
    numericInput.addEventListener("input", function() {
    // Remove non-numeric characters using regular expression
    this.value = this.value.replace(/\D/g, "");
    });
    const url = BACKEND_BASE_API + `${"providers/providers/"}`
    reloadProviders(url);

    usernameInput.addEventListener("keyup", function(event){
        const value = event.target.value;
        usernameInput.value = value;
        usernameInput.textContent = value;
    });

    firstNameInput.addEventListener("keyup", function(event){
        const value = event.target.value;
        firstNameInput.value = value;
        firstNameInput.textContent = value;
    });

    lastNameInput.addEventListener("keyup", function(event){
        const value = event.target.value;
        lastNameInput.value = value;
        lastNameInput.textContent = value;
    });

    otherNamesInput.addEventListener("keyup", function(event){
        const value = event.target.value;
        otherNamesInput.value = value;
        otherNamesInput.textContent = value;
    });

    emailInput.addEventListener("keyup", function(event){
        const value = event.target.value;
        emailInput.value = value;
        emailInput.textContent = value;
    });

    phoneNumberInput.addEventListener("keyup", function(event){
        const value = event.target.value;
        phoneNumberInput.value = value;
        phoneNumberInput.textContent = value;
    });

    const providerSubmission = document.getElementById("provider-submission");
    providerSubmission.addEventListener("click", function(event){
        event.preventDefault();
        providerData.username = usernameInput.value;
        providerData.first_name = firstNameInput.value;
        providerData.last_name = lastNameInput.value;
        providerData.email = emailInput.value;
        providerData.phone_number = phoneNumberInput.value;
        console.log("The payload is ", providerData);
    });

    const providerTableSearchInput = document.getElementById("provider-table-search-input");
    providerTableSearchInput.addEventListener("keyup", function(event){
        const value = event.target.value;
        const url = BACKEND_BASE_API + `${"providers/providers/?search=" + value}`
        reloadProviders(url);
    });
});