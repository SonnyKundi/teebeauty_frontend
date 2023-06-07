const BACKEND_BASE_API = "http://localhost:8000/";

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

function populateTable(data, userTye){
    const bookingsTableData = document.getElementById("bookings-table-data");
    bookingsTableData.innerHTML=``
    let count = 1
    data.forEach(booking => {
        const tableRecord = document.createElement("tr");
        const serialNumber = document.createElement("td");
        serialNumber.textContent= count;
        count ++;
        tableRecord.appendChild(serialNumber);

        const serviceRow = document.createElement("td");
        serviceRow.textContent= booking.service_name;
        tableRecord.appendChild(serviceRow);

        if(userTye !== "PROVIDER"){
            const providerRow = document.createElement("td");
            providerRow.textContent= booking.provider_name;
            tableRecord.appendChild(providerRow);
        }

        const emailRow = document.createElement("td");
        emailRow.textContent= booking.email;
        tableRecord.appendChild(emailRow);

        const phoneNumberRow = document.createElement("td");
        phoneNumberRow.textContent= booking.phone_number;
        tableRecord.appendChild(phoneNumberRow);

        const whatsappNumberRow = document.createElement("td");
        whatsappNumberRow.textContent= booking.whatsapp_number;
        tableRecord.appendChild(whatsappNumberRow);

        const createdRow = document.createElement("td");
        createdRow.textContent= new Date(booking.created_on).toDateString();
        tableRecord.appendChild(createdRow);

        bookingsTableData.appendChild(tableRecord);
    });
};

document.addEventListener("DOMContentLoaded", function(event){
    event.preventDefault();
    var user = JSON.parse(localStorage.getItem("tersunUser"));
    console.log("THe user from the local storage is ", user);
    if(user === null){
      window.location.href = "login.html";
      return;
    };

    const activityUser = document.getElementById("activity-user");
    const greeting = document.createElement("p");
    greeting.textContent = "Welcome,";
    const name = document.createElement("a");
    name.textContent = user.full_name;
    name.classList.add("nav-link");

    activityUser.appendChild(greeting);
    activityUser.appendChild(name);
    activityUser.removeAttribute("hidden");

    const providerField = document.getElementById("provider-field");

    if(user.user_type === "CLIENT"){
        providerField.removeAttribute("hidden");
        const url = BACKEND_BASE_API + `appointments/bookings/?created_by=${user.id}`;
        getAPIData(url)
        .then(data => {
            populateTable(data, "CLIENT");
        });
    };

    if(user.user_type === "PROVIDER"){
        const url = BACKEND_BASE_API + `appointments/bookings/?provider_user_id=${user.id}`;
        getAPIData(url)
        .then(data => {
            populateTable(data, "PROVIDER");
        });
    };

    if(user.user_type === "ADMIN"){
        providerField.removeAttribute("hidden");
        const url = BACKEND_BASE_API + `appointments/bookings/`;
        getAPIData(url)
        .then(data => {
            populateTable(data, "ADMIN");
        });
    };
});