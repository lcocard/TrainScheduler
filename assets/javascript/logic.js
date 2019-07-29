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
var key = "";

function currentTime() {
    var current = moment().format('LT');
    $("#currentTime").html(current);
    setTimeout(currentTime, 1000);
};



// Wait until the DOM has been fully parsed
window.addEventListener("DOMContentLoaded", function () {

    database.ref().on("child_added", function (childSnapshot) {

        // Log everything that's coming out of childSnapshot
        console.log(childSnapshot.val().TrainName);
        console.log(childSnapshot.val().Destination);
        console.log(childSnapshot.val().FirstTrain);
        console.log(childSnapshot.val().Frequency);

        // Assumptions
        var tFrequency = 3;

        // Time is 3:30 AM
        var firstTime = childSnapshot.val().FirstTrain;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(
            1,
            "years"
        );
        console.log("firstTimeConverted = " + firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm A"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % childSnapshot.val().Frequency;
        console.log("tRemainder = " + tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = childSnapshot.val().Frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

        key = childSnapshot.key

        // Create the new row
        var newRow = $("<tr>").append(
            $("<th align='left' scope='row'>").text(childSnapshot.val().TrainName),
            $("<td align='left'>").text(childSnapshot.val().Destination),
            $("<td align='left'>").text(childSnapshot.val().Frequency),
            $("<td align='left'>").text(nextTrain.format("hh:mm A")),
            $("<td align='left'>").text(tMinutesTillTrain),
            $("<td align='left' style='margin-bottom: 4px;'><button style='background-color: #077abc; margin: 0; padding: 2px 8px 2px 8px; margin-bottom: 16px;' class='deleteTrain btn btn-primary btn-sm' data-key='" + key + "'>X</button></td>")
        );

        // Append the new row to the table
        $("#train-scheduler-body").append(newRow);

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);

    });

    // Get DOM references:

    // Get the input values
    theForm = document.querySelector("#frmTrainInput");
    InputTrainName = document.querySelector("#InputTrainName");
    InputDestination = document.querySelector("#InputDestination");
    InputFirstTrain = document.querySelector("#InputFirstTrain");
    InputFrequency = document.querySelector("#InputFrequency");
    theSubmitButton = document.getElementById("#submitTrain");



    // Because forms can be submitted via submit buttons but also from pressing ENTER,
    // we need to make sure the form has gone through custom validation before submit
    // actually happens. So, we'll validate on the submit button's click event as well
    // as the form submit.


    theForm.addEventListener("submit", validate);
    submitTrain.addEventListener("invalid", validate);

    InputTrainName.addEventListener('input', function (e) {
        e.target.setCustomValidity('');
    });
    InputDestination.addEventListener('input', function (e) {
        e.target.setCustomValidity('');
    });
    InputFirstTrain.addEventListener('input', function (e) {
        e.target.setCustomValidity('');
    });
    InputFrequency.addEventListener('input', function (e) {
        e.target.setCustomValidity('');
    });

    database.ref().on("child_added", function (childSnapshot) {

    });

    //Delete train row using the button

    $(document).on("click", ".deleteTrain", function () {
        keyref = $(this).attr("data-key");
        database.ref().child(keyref).remove();
        window.location.reload();
    });

    // Check to see if the train name is unique:



    function validate(evt) {


        // Reset the validity
        InputTrainName.setCustomValidity("");
        InputDestination.setCustomValidity("");
        InputFirstTrain.setCustomValidity("");
        InputFrequency.setCustomValidity("");

        validateTrainName = function (value) {
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10) {
                return true;
            }
            return false;
        }

        // Check to see if the form is INVALID for any reason
        if (!theForm.checkValidity()) {
            // Check to see if it is the Train Name that is the problem:
            if (!InputTrainName.validity.valid) {
                // Set up your own custom error message from whatever source you like
                // Here, it's just hard coded:
                InputTrainName.setCustomValidity("Please enter a valid train name!");
            } else {
                // Check to see if it is the Destination that is the problem:
                if (!InputDestination.validity.valid) {
                    // Set up your own custom error message from whatever source you like
                    // Here, it's just hard coded:
                    InputDestination.setCustomValidity("Please enter a valid destination!");
                } else {
                    // Check to see if it is the First Train Time that is the problem:
                    if (!InputFirstTrain.validity.valid) {
                        // Set up your own custom error message from whatever source you like
                        // Here, it's just hard coded:
                    } else {
                        // Check to see if it is the Frequency that is the problem:
                        if (!InputFrequency.validity.valid) {
                            // Set up your own custom error message from whatever source you like
                            // Here, it's just hard coded:
                            InputFrequency.setCustomValidity("Please enter a valid frequency time!");

                        }
                    }
                }
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

        database.ref().push({
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

    currentTime();

    setInterval(function () {
        window.location.reload();
    }, 60000);
});

