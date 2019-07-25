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

var validTrainName = 0;
var validDestination = 0;
var validFirstTrainTime = 0;
var validFrequency = 0;


// Wait until the DOM has been fully parsed
window.addEventListener("DOMContentLoaded", function () {

    database.ref().on("child_added", function (snapshot) {

        // Log everything that's coming out of snapshot
        console.log(snapshot.val().TrainName);
        console.log(snapshot.val().Destination);
        console.log(snapshot.val().FirstTrain);
        console.log(snapshot.val().Frequency);

        // Create the new row
        var newRow = $("<tr>").append(
            $("<th scope='row'>").text(snapshot.val().TrainName),
            $("<td>").text(snapshot.val().Destination),
            $("<td>").text(snapshot.val().FirstTrain),
            $("<td>").text(snapshot.val().Frequency),
            //$("<td>").text(minAway),
        );

        // Append the new row to the table
        $("#train-scheduler > tbody").append(newRow);
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);

    });

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



        // Reset the validity
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
                //validTrainName = 0;
                //console.log("validTrainName 1 = " + validTrainName);
            } else {
                InputTrainName.setCustomValidity("Valid");
                //console.log("InputTrainName.setCustomValidity = " + InputTrainName.setCustomValidity);
                validTrainName = 1;
                console.log("validTrainName 2 = " + validTrainName);
            }

            // Check to see if it is the Destination that is the problem:
            if (!InputDestination.validity.valid) {
                // Set up your own custom error message from whatever source you like
                // Here, it's just hard coded:
                InputDestination.setCustomValidity("Please enter a valid destination!");
                //validDestination = 0;
                //console.log("validDestination 1 = " + validDestination);
            } else {
                InputDestination.setCustomValidity("Valid");
                //console.log("InputDestination.setCustomValidity = " + InputDestination.setCustomValidity);
                validDestination = 1;
                console.log("validDestination 2 = " + validDestination);
            }

            // Check to see if it is the First Train Time that is the problem:
            if (!InputFirstTrain.validity.valid) {
                // Set up your own custom error message from whatever source you like
                // Here, it's just hard coded:
                InputFirstTrain.setCustomValidity("Please enter a valid start time!");
                //var validFirstTrainTime = 0;
                //console.log("validFirstTrainTime 1 = " + validFirstTrainTime);
            } else {
                InputFirstTrain.setCustomValidity("Valid");
                //console.log("InputFirstTrain.setCustomValidity = " + InputFirstTrain.setCustomValidity);
                var validFirstTrainTime = 1;
                console.log("validFirstTrainTime 2 = " + validFirstTrainTime);

            }

            // Check to see if it is the Frequency that is the problem:
            if (!InputFrequency.validity.valid) {
                // Set up your own custom error message from whatever source you like
                // Here, it's just hard coded:
                InputFrequency.setCustomValidity("Please enter a valid frequency time!");
                //var validFrequency = 0;
                //console.log("validFrequency 1 = " + validFrequency);

            } else {
                InputFrequency.setCustomValidity("Valid");
                //console.log("InputFrequency.setCustomValidity = " + InputFrequency.setCustomValidity);
                var validFrequency = 1;
                console.log("validFrequency 2 = " + validFrequency);
            }
        }

        //if ((validTrainName === 1) && (validDestination === 1) && (validFirstTrainTime === 1) && (validFrequency === 1)) {

        var valInputTrainName = $("#InputTrainName").val();
        var valInputDestination = $("#InputDestination").val();
        var valInputFirstTrain = $("#InputFirstTrain").val();
        var valInputFrequency = $("#InputFrequency").val();

        // Log 
        console.log("InputTrainName = " + valInputTrainName);
        console.log("InputDestination = " + valInputDestination);
        console.log("InputFirstTrain = " + valInputFirstTrain);
        console.log("InputFrequency = " + valInputFrequency);

        database.ref().push({
            TrainName: valInputTrainName,
            Destination: valInputDestination,
            FirstTrain: valInputFirstTrain,
            Frequency: valInputFrequency

        });

        // Firebase watcher + initial loader HINT: .on("value")
        database.ref().on("child_added", function (snapshot) {
            // Log everything that's coming out of snapshot
            console.log(snapshot.val());
            console.log(snapshot.val().TrainName);
            console.log(snapshot.val().Destination);
            console.log(snapshot.val().FirstTrain);
            console.log(snapshot.val().Frequency);
            // Change the HTML to reflect
            // $("#InputTrainName").text(snapshot.val().name);
            //  $("#InputDestination").text(snapshot.val().email);
            // $("#InputFirstTrain").text(snapshot.val().age);
            // $("#InputFrequency").text(snapshot.val().comment);

            // Create the new row
            var newRow = $("<tr>").append(
                $("<th scope='row'>").text(snapshot.val().TrainName),
                $("<td>").text(snapshot.val().Destination),
                $("<td>").text(snapshot.val().FirstTrain),
                $("<td>").text(snapshot.val().Frequency),
                //$("<td>").text(minAway),
            );

            // Append the new row to the table
            $("#train-scheduler > tbody").append(newRow);
        }, function (errorObject) {
            console.log("Errors handled: " + errorObject.code);

        });



        $("#InputTrainName").val("");
        $("#InputDestination").val("");
        $("#InputFirstTrain").val("");
        $("#InputFrequency").val("");
        //} else {
        //    alert("Your data is invalid, please verify and try to submit again.")
        //}
    }
});

