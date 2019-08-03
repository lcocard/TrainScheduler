(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process){
/* *********************** Train Scheduler - logic.js ****************** */

/* global moment firebase */

// Initialize Firebase

require('dotenv').config();
var api_key = process.env.API_KEY;
var appId = process.env.appId;
var messagingSenderId = process.env.messagingSenderId;
var projectId = process.env.projectId;

var dbconfig = {
    apiKey: "api_key",
    authDomain: "trainscheduler-c6ded.firebaseapp.com",
    databaseURL: "https://trainscheduler-c6ded.firebaseio.com",
    projectId: "projectId",
    storageBucket: "trainscheduler-c6ded.appspot.com",
    messagingSenderId: "messagingSenderId",
    appId: "appId"
};

firebase.initializeApp(dbconfig);

// Create a variable to reference the database
var database = firebase.database();

var validTrainName = 0;
var validDestination = 0;
var validFirstTrainTime = 0;
var validFrequency = 0;
var key = "";
var $FrequencyTimeValue;
var $keyValue;

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

        // This is the Firebase key associated with the values submitted using the input/button elements
        key = childSnapshot.key

        // Create the new row
        var newRow = $("<tr>").append(
            $("<th align='left' scope='row'>").text(childSnapshot.val().TrainName),
            $("<td align='left'>").text(childSnapshot.val().Destination),
            $("<td align='left'>").text(childSnapshot.val().Frequency),
            $("<td align='left'>").text(nextTrain.format("hh:mm A")),
            $("<td align='left'>").text(tMinutesTillTrain),
            // The Firebase key is stored on the delete button here
            $("<td align='left' style='margin-bottom: 4px;'><button style='background-color: #077abc; margin: 0; padding: 2px 8px 2px 8px; margin-bottom: 16px;' class='deleteTrain btn btn-primary btn-sm' data-key='" + key + "'>X</button></td>")
        );

        // Append the new row to the table
        $("#train-scheduler-body").append(newRow);

        // Select table row and read the values in the columns (also: var id = $(this).next.text();)
        $('#train-scheduler').on('click', 'tr', function () {
            $(this).addClass('selected').siblings().removeClass('selected');
            // Retrieving the Firebase key associated with this data row (record) from the Delete button
            var $keyValue = $(this).find('button').attr("data-key");
            var $TrainNameValueTemp = $(this).find('th:first').text();
            var $DestinationValueTemp = $(this).find('td:first').text();
            var $FrequencyTimeValueTemp = $(this).find('td:eq(1)').text();
            var $FirstTrainTimeValueAmPmTemp = $(this).find('td:eq(2)').text();
            // convert time in military format
            FirstTrainTimeValueTempFORM = "HH:mm";
            convertedFirstTrainTimeValue = moment($FirstTrainTimeValueAmPmTemp, FirstTrainTimeValueTempFORM);
            $FirstTrainTimeValueTemp = convertedFirstTrainTimeValue.format("HH:mm");
            //alert($FrequencyTimeValue);

            // Store the read values into the localStorage
            localStorage.setItem("trainNameTemp1", $TrainNameValueTemp);
            localStorage.setItem("destinationTemp1", $DestinationValueTemp);
            localStorage.setItem("firstTrainTemp1", $FirstTrainTimeValueTemp);
            localStorage.setItem("frequencyTemp1", $FrequencyTimeValueTemp);
            localStorage.setItem("$keyValue", $keyValue);


            // Get the items from the localStorage and display them in the input boxes
            $("#InputTrainName").val(localStorage.getItem("trainNameTemp1"));
            $("#InputDestination").val(localStorage.getItem("destinationTemp1"));
            $("#InputFirstTrain").val(localStorage.getItem("firstTrainTemp1"));
            $("#InputFrequency").val(localStorage.getItem("frequencyTemp1"));
            //Storing the Firebase key in the local storage so it can be used for updating the same record in Firebase
            $($keyValue).val(localStorage.getItem("$keyValue"));
            //alert($keyValue);

        });

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


    // Save input values to temp local storage
    // Similar, we can use Firebase sessionStorage

    $(".form-field").on("keyup", function () {
        var trainNameTemp = $("#InputTrainName").val().trim();
        var destinationTemp = $("#InputDestination").val().trim();
        var firstTrainTemp = $("#InputFirstTrain").val().trim();
        var FrequencyTemp = $("#InputFrequency").val().trim();

        localStorage.setItem("trainNameTemp1", trainNameTemp);
        localStorage.setItem("destinationTemp1", destinationTemp);
        localStorage.setItem("firstTrainTemp1", firstTrainTemp);
        localStorage.setItem("frequencyTemp1", FrequencyTemp);
    });

    $("#InputTrainName").val(localStorage.getItem("trainNameTemp1"));
    $("#InputDestination").val(localStorage.getItem("destinationTemp1"));
    $("#InputFirstTrain").val(localStorage.getItem("firstTrainTemp1"));
    $("#InputFrequency").val(localStorage.getItem("frequencyTemp1"));

    // Set cookie for iOS

    //Cookies.set('trainNameTemp2', 'true');
    //Cookies.set('destinationTemp2', 'true');
    //Cookies.set('firstTrainTemp2', 'true');
    //Cookies.set('FrequencyTemp2', 'true');

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



        // Save input values to Firebase real time storage

        var valInputTrainName = $("#InputTrainName").val();
        var valInputDestination = $("#InputDestination").val();
        var valInputFirstTrain = $("#InputFirstTrain").val();
        var valInputFrequency = $("#InputFrequency").val();

        // Log 
        console.log("InputTrainName = " + valInputTrainName);
        console.log("InputDestination = " + valInputDestination);
        console.log("InputFirstTrain = " + valInputFirstTrain);
        console.log("InputFrequency = " + valInputFrequency);

        // if localStorage $keyValue is not null, when we click the submit button we want to update the record, not create a new one

        if (localStorage.getItem("$keyValue") !== null) {
            keyref = localStorage.getItem("$keyValue")
            console.log("keyref = " + keyref)

            $(valInputTrainName).val(localStorage.getItem("trainNameTemp1"));
            $(valInputDestination).val(localStorage.getItem("destinationTemp1"));
            $(valInputFirstTrain).val(localStorage.getItem("firstTrainTemp1"));
            $(valInputFrequency).val(localStorage.getItem("frequencyTemp1"));

            database.ref().child(keyref).update({ TrainName: valInputTrainName, Destination: valInputDestination, FirstTrain: valInputFirstTrain, Frequency: valInputFrequency });
            window.location.reload();

            // Clear localStorage
            // Similar, we can clear Firebase sessionStorage
            localStorage.clear();

            $("#InputTrainName").val("");
            $("#InputDestination").val("");
            $("#InputFirstTrain").val("");
            $("#InputFrequency").val("");

        } else {

            //key doesn't exist in localStorage ==> create new record

            database.ref().push({
                TrainName: valInputTrainName,
                Destination: valInputDestination,
                FirstTrain: valInputFirstTrain,
                Frequency: valInputFrequency,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });

            // Clear localStorage
            // Similar, we can clear Firebase sessionStorage
            localStorage.clear();

            $("#InputTrainName").val("");
            $("#InputDestination").val("");
            $("#InputFirstTrain").val("");
            $("#InputFrequency").val("");

        }

    }

    currentTime();

    setInterval(function () {
        window.location.reload();
    }, 60000);
});


}).call(this,require('_process'))
},{"_process":5,"dotenv":2}],2:[function(require,module,exports){
(function (process){
/* @flow */
/*::

type DotenvParseOptions = {
  debug?: boolean
}

// keys and values from src
type DotenvParseOutput = { [string]: string }

type DotenvConfigOptions = {
  path?: string, // path to .env file
  encoding?: string, // encoding of .env file
  debug?: string // turn on logging for debugging purposes
}

type DotenvConfigOutput = {
  parsed?: DotenvParseOutput,
  error?: Error
}

*/

const fs = require('fs')
const path = require('path')

function log (message /*: string */) {
  console.log(`[dotenv][DEBUG] ${message}`)
}

const NEWLINE = '\n'
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
const RE_NEWLINES = /\\n/g

// Parses src into an Object
function parse (src /*: string | Buffer */, options /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {
  const debug = Boolean(options && options.debug)
  const obj = {}

  // convert Buffers before splitting into lines and processing
  src.toString().split(NEWLINE).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]
      // default undefined or missing values to empty string
      let val = (keyValueArr[2] || '')
      const end = val.length - 1
      const isDoubleQuoted = val[0] === '"' && val[end] === '"'
      const isSingleQuoted = val[0] === "'" && val[end] === "'"

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end)

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE)
        }
      } else {
        // remove surrounding whitespace
        val = val.trim()
      }

      obj[key] = val
    } else if (debug) {
      log(`did not match key and value when parsing line ${idx + 1}: ${line}`)
    }
  })

  return obj
}

// Populates process.env from .env file
function config (options /*: ?DotenvConfigOptions */) /*: DotenvConfigOutput */ {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding /*: string */ = 'utf8'
  let debug = false

  if (options) {
    if (options.path != null) {
      dotenvPath = options.path
    }
    if (options.encoding != null) {
      encoding = options.encoding
    }
    if (options.debug != null) {
      debug = true
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug })

    Object.keys(parsed).forEach(function (key) {
      if (!process.env.hasOwnProperty(key)) {
        process.env[key] = parsed[key]
      } else if (debug) {
        log(`"${key}" is already defined in \`process.env\` and will not be overwritten`)
      }
    })

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

module.exports.config = config
module.exports.parse = parse

}).call(this,require('_process'))
},{"_process":5,"fs":3,"path":4}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":5}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);
