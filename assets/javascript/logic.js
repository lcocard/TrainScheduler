/* *********************** Train Scheduler - logic.js ****************** */

/* global moment firebase */

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCF_--ynJN8S7UkOBkUPBVuVSxAZcxxsss",
    authDomain: "trainscheduler-c6ded.firebaseapp.com",
    databaseURL: "https://trainscheduler-c6ded.firebaseio.com",
    projectId: "trainscheduler-c6ded",
    storageBucket: "trainscheduler-c6ded.appspot.com",
    messagingSenderId: "973729106226",
    appId: "1:973729106226:web:99ef4ff13c69bf0c"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Wait until the DOM has been fully parsed
window.addEventListener("DOMContentLoaded", function () {

    // Get DOM references:

    // Get the input values
    var theForm = document.querySelector("#frmTrainInput");
    var InputTrainName = document.querySelector("#InputTrainName");
    var InputDestination = document.querySelector("#InputDestination");
    var InputFirstTrain = document.querySelector("#InputFirstTrain");
    var InputFrequency = document.querySelector("#InputFrequency");
    var theSubmitButton = document.getElementById("#submitTrain");



    // Because forms can be submitted via submit buttons but also from pressing ENTER,
    // we need to make sure the form has gone through custom validation before submit
    // actually happens. So, we'll validate on the submit button's click event as well
    // as the form submit.


    theForm.addEventListener("submit", validate);
    submitTrain.addEventListener("click", validate);

    function validate(evt) {

        alert("hello reset");

        // Reset the validity of the phone number
        InputTrainName.setCustomValidity("");
        InputDestination.setCustomValidity("");
        InputFirstTrain.setCustomValidity("");
        InputFrequency.setCustomValidity("");

        // Check to see if the form is INVALID for any reason
        if (!theForm.checkValidity()) {

            // Check to see if it is the Train Name that is the problem:
            if (!InputTrainName.validity.valid) {
                // Set up your own custom error message from whatever source you like
                // Here, it's just hard coded:
                InputTrainName.setCustomValidity("Please enter a valid train name!");
            }

            // Check to see if it is the Destination that is the problem:
            if (!InputDestination.validity.valid) {
                // Set up your own custom error message from whatever source you like
                // Here, it's just hard coded:
                InputDestination.setCustomValidity("Please enter a valid destination!");
            }

            // Check to see if it is the First Train Time that is the problem:
            if (!InputFirstTrain.validity.valid) {
                // Set up your own custom error message from whatever source you like
                // Here, it's just hard coded:
                InputFirstTrain.setCustomValidity("Please enter a valid start time!");
            }

            // Check to see if it is the Frequency that is the problem:
            if (!InputFrequency.validity.valid) {
                // Set up your own custom error message from whatever source you like
                // Here, it's just hard coded:
                InputFrequency.setCustomValidity("Please enter a valid frequency time!");
            }

        }

        var valInputTrainName = $("#InputTrainName").val();
        var valInputDestination = $("#InputDestination").val();
        var valInputFirstTrain = $("#InputFirstTrain").val();
        var valInputFrequency = $("#InputFrequency").val();

        // Log 
        console.log("InputTrainName = " + valInputTrainName);
        console.log("InputDestination = " + valInputDestination);
        console.log("InputFirstTrain = " + valInputFirstTrain);
        console.log("InputFrequency = " + valInputFrequency);

        database.ref().set({
            TrainName: valInputTrainName,
            Destination: valInputDestination,
            FirstTrain: valInputFirstTrain,
            Frequency: valInputFrequency

        });


        $("#InputTrainName").val("");
        $("#InputDestination").val("");
        $("#InputFirstTrain").val("");
        $("#InputFrequency").val("");

    }
});

