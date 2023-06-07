const BACKEND_BASE_API = "http://localhost:8000/";
let paymentData = {
    provider: "",
    amount_paid: "",
    payment_method: "",
    receipt_number: "",
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

field1 = document.getElementById("provider-search-input");
field2 = document.getElementById("amount-input");
field3 = document.getElementById("receipt-number-input");
field4 = document.getElementById("payment-method-selector");

function checkRequiredFields() {
    const myButton = document.getElementById("payment-submission");
    if (field1.value.trim() !== "" && field2.value.trim() !== "" && field3.value.trim() !== "" && field4.value.trim() !== "" && paymentData.provider.trim() !== "") {
      myButton.removeAttribute("disabled");
    } else {
      myButton.setAttribute("disabled", "disabled");
    };
};

field1.addEventListener("input", checkRequiredFields);
field2.addEventListener("input", checkRequiredFields);
field3.addEventListener("input", checkRequiredFields);
field4.addEventListener("input", checkRequiredFields);

function populateTable(data){
    const paymentsTableData = document.getElementById("payments-table-data");
    paymentsTableData.innerHTML=``
    let count = 1
    data.forEach(payment => {
        const tableRecord = document.createElement("tr");
        const serialNumber = document.createElement("td");
        serialNumber.textContent= count;
        count ++;
        tableRecord.appendChild(serialNumber);

        const provider = document.createElement("td");
        provider.textContent= payment.provider_name;
        tableRecord.appendChild(provider);

        const amount = document.createElement("td");
        amount.textContent= payment.amount_paid;
        tableRecord.appendChild(amount);

        const receiptNumber = document.createElement("td");
        receiptNumber.textContent= payment.receipt_number;
        tableRecord.appendChild(receiptNumber);

        const paymentMethod = document.createElement("td");
        paymentMethod.textContent= payment.payment_method;
        tableRecord.appendChild(paymentMethod);

        const paymentCode = document.createElement("td");
        paymentCode.textContent= payment.payment_code;
        tableRecord.appendChild(paymentCode);

        const paymentDate = document.createElement("td");
        paymentDate.textContent= new Date(payment.payment_date).toDateString();
        tableRecord.appendChild(paymentDate);

        paymentsTableData.appendChild(tableRecord);
    });
};

function reloadTable(url){
    getAPIData(url)
    .then(data => {
        populateTable(data)
    })
    .catch(err => {
        alert(err)
    });
};

function clearForm(){
    const providerSearchInput = document.getElementById("provider-search-input");
    providerSearchInput.value = ""
    providerSearchInput.textContent = ""

    const amountPaidElement = document.getElementById("amount-input");
    amountPaidElement.value = ""
    amountPaidElement.textContent = ""

    const receiptNumberInput = document.getElementById("receipt-number-input");
    receiptNumberInput.value = ""
    receiptNumberInput.textContent = ""

    const paymentMethodSelect = document.getElementById("payment-method-selector");
    paymentMethodSelect.selectedIndex = 0

    const paymentCodeInput = document.getElementById("payment-code-input");
    paymentCodeInput.value = ""
    paymentCodeInput.textContent = ""
}

document.addEventListener("DOMContentLoaded", function(){
    let paymentsUrl = BACKEND_BASE_API + `${"payments/provider_payments/"}`;
    reloadTable(paymentsUrl)
    const numericInput = document.getElementById("amount-input");
    numericInput.addEventListener("input", function() {
    // Remove non-numeric characters using regular expression
    this.value = this.value.replace(/\D/g, "");
    });

    const providerSearchInput = document.getElementById("provider-search-input");
    providerSearchInput.addEventListener("keyup", function(event){
        const searchValue = event.target.value;
        const url = BACKEND_BASE_API + `${"providers/providers/?search=" + searchValue}`;

        getAPIData(url)
        .then(data => {
            const providerSearchResult = document.getElementById("provider-search-result");
            if(data.length >= 1){
                providerSearchResult.style.display="block";
            }
            else{
                providerSearchResult.style.display="none";
            };

            const providerSearchResultList = document.getElementById("provider-search-result-list");
            providerSearchResultList.innerHTML=``
            data.forEach(provider => {
                const providerEntry = document.createElement("li")
                const displayName = `${provider.full_name + " @" + provider.username}`;
                providerEntry.textContent = displayName;
                providerEntry.addEventListener("click", function(){
                    paymentData.provider = provider.id;
                    providerSearchResult.style.display="none";
                    providerSearchInput.value = displayName;
                    providerSearchInput.textContent = displayName;
                });
                providerSearchResultList.appendChild(providerEntry)
            });
        })
        .catch(err => {
            alert(err);
        });
    });

    const amountPaidElement = document.getElementById("amount-input");
    amountPaidElement.addEventListener("keyup", function(event){
        const value = event.target.value
        amountPaidElement.value = value
    });

    const receiptNumberInput = document.getElementById("receipt-number-input");
    receiptNumberInput.addEventListener("keyup", function(event){
        const value = event.target.value
        receiptNumberInput.value = value
    });

    const paymentMethodSelect = document.getElementById("payment-method-selector");
    paymentMethodSelect.addEventListener("keyup", function(event){
        const value = event.target.value
        paymentMethodSelect.value = value
    });

    const paymentCodeInput = document.getElementById("payment-code-input");
    paymentCodeInput.addEventListener("keyup", function(event){
        const value = event.target.value
        paymentCodeInput.value = value
    });

    const submitButton = document.getElementById("payment-submission");
    submitButton.addEventListener("click", function(event){
        event.preventDefault();
        paymentData.created_by="85ca1206-4461-4924-a78a-8854b5c5e450"
        paymentData.updated_by="85ca1206-4461-4924-a78a-8854b5c5e450"
        paymentData.amount_paid=amountPaidElement.value;
        paymentData.receipt_number=receiptNumberInput.value;
        paymentData.payment_method=paymentMethodSelect.value;
        paymentData.payment_code=paymentCodeInput.value;
        const url = BACKEND_BASE_API + `${"payments/provider_payments/"}`;
        postAPIData(url, paymentData)
        .then(response => {
            reloadTable(paymentsUrl);
            clearForm();
            checkRequiredFields();
        })
        .catch(err => {
            alert(err);
        });
    });

    const tableSearchInput = document.getElementById("table-search-input");
    tableSearchInput.addEventListener("keyup", function(event){
        const value = event.target.value;
        console.log("Will be searching for the value ", value);
        let paymentsUrl = BACKEND_BASE_API + `${"payments/provider_payments/?search=" + value}`;
        console.log("Will be searching for the value ", paymentsUrl);
        reloadTable(paymentsUrl);
    });
});