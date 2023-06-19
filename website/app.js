/* Weather Journal App - using GET and POST routes
 * The App takes the user input - ZIP code and feelings that day,
 * accesses the OpenWeather API to get the temperature
 * and stores this data with appropriate date.
 * Most recent entry is automatically updated on the page.
*/



/* Global Variables */

// Personal API Key for OpenWeatherMap API
const apiKey = '<c4118ac8f4fdbfee310a33ce3167101b>&units=imperial';

let zip;
let temp;
let content;

let received = false;

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getDate()+'.'+(d.getMonth()+1)+'.'+ d.getFullYear();
//console.log(newDate);



/* Helper functions */

// Check if the ZIP code is not empty, and it has 5 digits
// Spanish 5-digits ZIP code, two first digits between 01 and 52
/*function checkZipInput() {
    var zipInput = document.forms["submitEntry"]["zipCode"].value;
    if (zipInput == null || zipInput == "" || zipInput.toString().length != 5) {
        alert("Please enter correct ZIP code (5 digits)");
        console.log('Wrong ZIP code input');
        return false;
    } else {
        console.log('ZIP correct');
        return true;
    }
}
*/

// Check if the ZIP code is not empty, and it has 5 digits
// Spanish 5-digits ZIP code: two first digits between 01 and 52
/*function checkZipInput() {
    var zipInput = document.forms["submitEntry"]["zipCode"].value;
    if (zipInput == null || zipInput == "" || zipInput.length != 5) {
        alert("Please enter correct ZIP code (5 digits)");
        console.log('Wrong ZIP code input');
        return false;
    } else if (!(/^\d+$/.test(zipInput))) {
        console.log("Use only numbers");
        return false;
    } else if (!(/^[0-4]$/.test(zipInput.charAt(0))) 
    || !(/^[5]$/.test(zipInput.charAt(0)) && /^[0-2]$/.test(zipInput.charAt(1))) 
    || !(/^[0]$/.test(zipInput.charAt(0)) && /^[0]$/.test(zipInput.charAt(1)))) {
        console.log("Wrong spanish ZIP code");
        return false;
    } else {
        console.log('ZIP correct');
        return true;
    }
}
*/

// Check if the ZIP code is not empty, and mathes the pattern (5 digits)
// for Spanish 5-digits ZIP code: two first digits between 01 and 52
function checkZipInput() {
    var zipInput = document.forms["submitEntry"]["zipCode"].value;
    if (zipInput == "" || document.forms["submitEntry"]["zipCode"].validity.patternMismatch) {
        alert("Please enter correct ZIP code (5 digits)");
        console.log('Wrong ZIP code input');
        return false;
    } else if (!((/^[0-4]$/.test(zipInput.charAt(0))) 
    || (/^[5]$/.test(zipInput.charAt(0)) && /^[0-2]$/.test(zipInput.charAt(1))) 
    || (/^[0]$/.test(zipInput.charAt(0)) && /^[0]$/.test(zipInput.charAt(1))))) {
        console.log("Wrong spanish ZIP code");
        return false;
    } else {
        console.log('ZIP correct');
        zip = zipInput;
        return true;
    }
}

// Check if the feelings input is not empty
function checkFeelingsInput() {
    var feelInput = document.getElementById('feelings');
    content = feelInput.value;
    if (content == null || content == "") {
        alert("Please enter your feelings");
        console.log('Wrong feelings input');
        return false;
    } else {
        console.log('Feelings correct');
        return true;
    }
}



const postData = async ( url = '/addData', data = {})=>{
    const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    });
    
    try {
        const newData = await response.json();
        console.log('Response data:', newData);
        return newData;
    } catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }
}


//Add listener for 'Generate' button
function addListenerForButton() {
    let btn = document.getElementById('generate');
    btn.addEventListener('click', function() {
        let myPromise1 = new Promise(function(myResolve, myReject) {
            if (checkZipInput() && checkFeelingsInput()) {
                generateEntry();
                received = true;
            } else {
                console.log("Error - wrong input");
            }
            /*.then(postData('/addData', {date: newDate, temp: 27, content: content}));
            .catch(console.log('Error3'));*/
        })
    });
};


function generateEntry() {
    console.log("Input received and correct");
    zip = document.getElementById('zip').value;
    console.log('ZIP:', zip);
    content = document.getElementById('feelings').value;
    console.log('Feelings: ', content);
    postData('/addData', {date: newDate, temp: 27, content: content});
    return true;
}

addListenerForButton();






/* Function to POST data */
//should work
/*const postData = async ( url = '/addData', data = {})=>{
    const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    });
    
    try {
        const newData = await response.json();
        console.log('Response data:', newData);
        return newData;
    } catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }
}
*/

// Call Function
//postData('/addData', {date: newDate, temp: 27, content: content});
//postData('/addData', {date: newDate, temp: 18, content: 'A bit colder'});

/*let myPromise2 = new Promise(function(myResolve, myReject) {
    if (received) {
        postData('/addData', {date: newDate, temp: 27, content: content});
    } else {
        console.log("Error2");
    }
})*/




/* Main functions */

/* Call functions */