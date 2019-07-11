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

$("#submitTrain").on("click", function (event) {
    event.preventDefault();
    // Get the input values
    var InputName = $("#InputName").val().trim();
    var InputName = $("#InputName").val().trim();
    var InputName = $("#InputName").val().trim();
    var bidderPrice = parseInt($("#bidder-price").val().trim());

    // Log the Bidder and Price (Even if not the highest)
    console.log(bidderName);
    console.log(bidderPrice);

    if (bidderPrice > highPrice) {

        // Alert
        alert("You are now the highest bidder.");

        // Save the new price in Firebase. This will cause our "value" callback above to fire and update
        // the UI.
        database.ref().set({
            highBidder: bidderName,
            highPrice: bidderPrice
        });

        // Log the new High Price
        console.log("New High Price!");
        console.log(bidderName);
        console.log(bidderPrice);
    }

    else {

        // Alert
        alert("Sorry that bid is too low. Try again.");
    }
});