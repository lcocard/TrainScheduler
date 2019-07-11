/* *********************** Train Scheduler - logic_1.js ****************** */

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

// Initial Values
var highPrice = 0;
var highBidder = "No one :-(";

// --------------------------------------------------------------

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on("value", function (snapshot) {

    // If Firebase has a highPrice and highBidder stored, update our client-side variables
    if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {
        // Set the variables for highBidder/highPrice equal to the stored values.
        highBidder = snapshot.val().highBidder;
        highPrice = parseInt(snapshot.val().highPrice);
    }

    // If Firebase does not have highPrice and highBidder values stored, they remain the same as the
    // values we set when we initialized the variables.
    // In either case, we want to log the values to console and display them on the page.
    console.log(highBidder);
    console.log(highPrice);
    $("#highest-bidder").text(highBidder);
    $("#highest-price").text(highPrice);

    // If any errors are experienced, log them to console.
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// --------------------------------------------------------------

// Whenever a user clicks the submit-bid

$("#submit-bid").on("click", function (event) {
    event.preventDefault();
    // Get the input values
    var bidderName = $("#bidder-name").val().trim();
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

/************************************************ */


// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase


// 2. Button for adding Employees
$("#add-employee-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var empName = $("#employee-name-input").val().trim();
    var empRole = $("#role-input").val().trim();
    var empStart = moment($("#start-input").val().trim(), "MM/DD/YYYY").format("X");
    var empRate = $("#rate-input").val().trim();

    // Creates local "temporary" object for holding employee data
    var newEmp = {
        name: empName,
        role: empRole,
        start: empStart,
        rate: empRate
    };

    // Uploads employee data to the database
    database.ref().push(newEmp);

    // Logs everything to console
    console.log(newEmp.name);
    console.log(newEmp.role);
    console.log(newEmp.start);
    console.log(newEmp.rate);

    alert("Employee successfully added");

    // Clears all of the text-boxes
    $("#employee-name-input").val("");
    $("#role-input").val("");
    $("#start-input").val("");
    $("#rate-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var empName = childSnapshot.val().name;
    var empRole = childSnapshot.val().role;
    var empStart = childSnapshot.val().start;
    var empRate = childSnapshot.val().rate;

    // Employee Info
    console.log(empName);
    console.log(empRole);
    console.log(empStart);
    console.log(empRate);

    // Prettify the employee start
    var empStartPretty = moment.unix(empStart).format("MM/DD/YYYY");

    // Calculate the months worked using hardcore math
    // To calculate the months worked
    var empMonths = moment().diff(moment(empStart, "X"), "months");
    console.log(empMonths);

    // Calculate the total billed rate
    var empBilled = empMonths * empRate;
    console.log(empBilled);

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(empName),
        $("<td>").text(empRole),
        $("<td>").text(empStartPretty),
        $("<td>").text(empMonths),
        $("<td>").text(empRate),
        $("<td>").text(empBilled)
    );

    // Append the new row to the table
    $("#employee-table > tbody").append(newRow);
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case
