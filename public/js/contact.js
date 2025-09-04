(function () {
"use strict";

    let form = document.querySelector('#contact-form');

    document
    .querySelector("#contact-form-button")
    .addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    let formValid = true;
    if (!form.checkValidity()) {
      formValid = false;
    }
    form.classList.add('was-validated')
    if (formValid) {
        sendTheEmail();
    }
});

function sendTheEmail() {
    console.log("You clicked the submit button.");
    let firstName = document.querySelector("#first-name").value;
    let lastName = document.querySelector("#last-name").value;
    let email = document.querySelector("#mail").value;
    let message = document.querySelector("#msg").value;
    console.log("First Name: " + firstName);
    console.log("Last Name: " + lastName);
    console.log("Email: " + email);
    console.log("Message: " + message);
}

})()

    //This below is the same as what's written above, but above uses an arrow function rather than a named function
    // document
    // .querySelector("#contact-form-button")
    // .addEventListener("click", submitMail);

// function submitMail() {
//     event.preventDefault();
//     event.stopPropagation();
//     console.log("You clicked the submit button.");
//     let name = document.querySelector("#name").value;
//     let email = document.querySelector("#mail").value;
//     let message = document.querySelector("#msg").value;
//     console.log("Name: " + name);
//     console.log("Email: " + email);
//     console.log("Message: " + message);
// }

// })();