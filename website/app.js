/* Weather Journal App - using GET and POST routes
 * The App takes the user input - ZIP code and feelings that day,
 * accesses the OpenWeather API to get the temperature
 * and stores this data with appropriate date.
 * Most recent entry is automatically updated on the page.
*/



/* Global Variables */

// Personal API Key for OpenWeatherMap API
const apiKey = 'c4118ac8f4fdbfee310a33ce3167101b&units=metric';
// c4118ac8f4fdbfee310a33ce3167101b&units=metric

let zip;
let temp;
let content;

let tempByZip;
let received = false;

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getDate()+'.'+(d.getMonth()+1)+'.'+ d.getFullYear();
//console.log(newDate);



/* Helper functions */

// Check if the ZIP code is not empty, and mathes the pattern (5 digits)
// for Spanish 5-digits ZIP code: two first digits between 01 and 52
function checkZipInput() {
    //var zipInput = document.getElementById('zip').value;
    var zipInput = document.forms["submitEntry"]["zipCode"].value;
    if (zipInput == "" || document.forms["submitEntry"]["zipCode"].validity.patternMismatch) {
        alert("Please enter correct ZIP code (5 digits)");
        console.log('Wrong ZIP code input');
        return false;
    } else if (!((/^[0-4]$/.test(zipInput.charAt(0))) 
    || (/^[5]$/.test(zipInput.charAt(0)) && /^[0-2]$/.test(zipInput.charAt(1))) 
    || (/^[0]$/.test(zipInput.charAt(0)) && /^[0]$/.test(zipInput.charAt(1))))) {
        alert("Spanish ZIP code should start with numbers between 01-52");
        console.log('Wrong Spanish ZIP code');
        return false;
    } else {
        console.log('ZIP correct');
        zip = zipInput;
        return true;
    };
};

// Check if the feelings input is not empty
function checkFeelingsInput() {
    var feelInput = document.getElementById('feelings').value;
    if (feelInput == null || feelInput == "") {
        alert("Please enter your feelings");
        console.log('Wrong feelings input');
        return false;
    } else {
        console.log('Feelings correct');
        content = feelInput;
        return true;
    };
};

// client-side POST method to add entry
async function postData (url = '/addData', data = {}) {
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
        console.log('Error - post data: ', error);
        // appropriately handle the error
    };
};

// GET function to display all entries from projectData object
/*const getEntries = async () => {
    const request = await fetch('/getData');
    try {
        const data = await request.json();
        console.log('getData: ', data);
    } catch (error) {
        console.log('Error while getting all data', error);
    };
};
*/

// Update HTML element with most recent entry
// when the page is loaded or when new entry is added
// using GET method to access most recent entry
async function updateMostRecentEntry() {
    const request = await fetch('/getRecent');
    try {
        const data = await request.json();
        let lastEntry = data;
        let dateRecent = lastEntry.date;
        let tempRecent = lastEntry.temp;
        let feelRecent = lastEntry.content;

        //console.log('Last entry: ', lastEntry);
        //console.log('Date-recent: ', dateRecent);
        //console.log('Temp-recent: ', tempRecent);
        //console.log('Feelings-recent: ', feelRecent);

        /* Update whole div container of last entry
        let divRecent = 
            `<div id="date">Date: ${dateRecent}</div> 
            <div id="temp">Temperature: ${tempRecent} C</div>
            <div id="content">Feelings: ${feelRecent}</div>`;
        let holder = document.getElementById('entryHolder');
        holder.innerHTML = divRecent;
        */
        // Update divs with given IDs
        document.getElementById('date').innerHTML = `<span>Date:</span> ${dateRecent}`;
        document.getElementById('temp').innerHTML = `<span>Temperature:</span> ${tempRecent} C`;
        document.getElementById('content').innerHTML = `<span>Feelings:</span> ${feelRecent}`;

        updateEntryClass(tempRecent); // adjust color for temperature levels
    } catch(error) {
        console.log('Error - get recent data: ', error);
        // appropriately handle the error
    };
    
};

// Add a class to div containter depending on the temperature level
// to adjust colors in css styles
function updateEntryClass(t) {
    cont = document.getElementById('entry-container');
    //element1.className = "newClass"; //erases previous
    if (t > 29) {
        cont.className = "hot";
    } else if (t > 21) {
        cont.className = "warm";
    } else if (t > 14) {
        cont.className = "mild";
    } else if (t > 7) {
        cont.className = "cool";
    } else if (t > 0) {
        cont.className = "cold";
    } else {
        cont.className = "freezing";
    };
};

// Access Open Weather to get the temperature for given ZIP code
async function getTemp (url) {
    const request = await fetch(url);
    try {
        var data = await request.json();
        // Get temperature from received data and round it to 1 decimal place
        // - stored in global variable temp
        temp = data.main.temp.toFixed(1);
        console.log('Temp obtained: ', temp);
        //return temp;
    } catch (error) {
        console.log('Error while obtaining temperature: ', error);
    };
};

function generateNewEntry() {
    if (checkZipInput() && checkFeelingsInput()) {
        let urlWeather = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},es&appid=${apiKey}`;
        getTemp(urlWeather)
        .then(postData('/addData', {date: newDate, temp: temp, content: content}))
        .then(updateMostRecentEntry())
        .catch((error) => {
            console.log('Error while generating new entry', error)
        }); 
        updateEntryClass(temp);
    } else {
        console.log('Error - wrong input submitted');
    };
};



/* Main functions */

// Add initial data
function addEntries() {
    return new Promise((resolve, reject) => {
        postData('/addData', {date: newDate, temp: 27, content: 'Feeling good'});
        postData('/addData', {date: newDate, temp: 18, content: 'A bit colder'});
        postData('/addData', {date: newDate, temp: 24, content: 'I am having really good day, it is warm and sunny. I went for a long walk aroud the city and was listening to music, so it was a nice time.'});
        let added = true;
        resolve(added);
    });
};

// After clicking the button: 
//read user input, check temperature, add entry, update HTML most recent entry
function addListenerForButton() {
    let btn = document.getElementById('generate');
    btn.addEventListener('click', function() {
        generateNewEntry();
    });
};



/* Call functions */

// Add initial data and generate most recent entry
const promiseInitial = addEntries();
promiseInitial.then((added) => {
    console.log('Initial data added successfully');
    updateMostRecentEntry(); // update HTML with most recent entry
    return added;
})
.catch((error) => {
    console.log('Error - initial promise: ', error);
});

// Add listener for 'Generate' button
addListenerForButton();