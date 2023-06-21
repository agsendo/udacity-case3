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
    var zipInput = document.forms["submitEntry"]["zipCode"].value;
    if (zipInput == "" || document.forms["submitEntry"]["zipCode"].validity.patternMismatch) {
        alert("Please enter correct ZIP code (5 digits)");
        console.log('Wrong ZIP code input');
        return false;
    } else if (!((/^[0-4]$/.test(zipInput.charAt(0))) 
    || (/^[5]$/.test(zipInput.charAt(0)) && /^[0-2]$/.test(zipInput.charAt(1))) 
    || (/^[0]$/.test(zipInput.charAt(0)) && /^[0]$/.test(zipInput.charAt(1))))) {
        alert("Spanish ZIP code should start with numbers between 01-52");
        console.log("Wrong Spanish ZIP code");
        return false;
    } else {
        console.log('ZIP correct');
        zip = zipInput;
        return true;
    }
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
    }
};

// client-side POST method to add entry
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
        console.log('Error - post data ', error);
        // appropriately handle the error
    }
};

// GET function to display all entries from projectData object
async function displayEntries() {
    fetch('/getData')
    .then (response => response.json())
    .then(data => console.log('getData: ', data))
    .catch('Error - get all data')
}







// Automatically generate most recent entry when the page is loaded
function generateMostRecentEntry() {
    fetch('/getRecent')
    .then (response => response.json())
    .then(data => {
        let lastEntry = data;
        let dateRecent = lastEntry.date;
        let tempRecent  = lastEntry.temp;
        let feelRecent = lastEntry.content;

        //console.log('Last entry: ', lastEntry);
        //console.log('Date-recent: ', dateRecent);
        //console.log('Temp-recent: ', tempRecent);
        //console.log('Feelings-recent: ', feelRecent);

        let divRecent = 
            `<div id="date">Date: ${dateRecent}</div> 
            <div id="temp">Temperature: ${tempRecent} C</div>
            <div id="content">Feelings: ${feelRecent}</div>`;
        let holder = document.getElementById('entryHolder');
        holder.innerHTML = divRecent;
        updateEntryClass(tempRecent);   // adjust color for temeprature levels
    })
};

// Update div using most recent entry when new one is added by user
function updateMostRecentEntry() {
    let divRecent = 
            `<div id="date">Date: ${newDate}</div> 
            <div id="temp">Temperature: ${temp} C</div>
            <div id="content">Feelings: ${content}</div>`;
        let holder = document.getElementById('entryHolder');
        holder.innerHTML = divRecent;
};

// Add a class to div containter depending on the temperature level
// to adjust colors in css styles
function updateEntryClass(temp) {
    cont = document.getElementById('entry-container');
    if (temp > 29) {
        //console.log('hot');
        cont.className = "hot";
    } else if (temp > 21) {
        //console.log('warm');
        cont.className = "warm";
    } else if (temp > 14) {
        //console.log('mild');
        cont.className = "mild";
    }
    //element1.className = "newClass"; //erases previous
};



async function getTemp(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error 3 while getting temperature: ', response.status);
        }
        var data = await response.json();
        temp = data.main.temp.toFixed(1);
        console.log('data obtained: ', temp);
        generateEntry();
        updateEntryClass(temp);
        return temp;
    } catch (error) {
        console.log('Error 4: ', error);
    }
};





function generateEntry() {
    console.log("Input received and correct");
    //zip = document.getElementById('zip').value;
    console.log('ZIP:', zip);
    //content = document.getElementById('feelings').value;
    console.log('Feelings: ', content);
    console.log('Temperature: ', temp);
    postData('/addData', {date: newDate, temp: temp, content: content});
    updateMostRecentEntry();
    return true;
};






/*let myPromise2 = new Promise(function(myResolve, myReject) {
    if (received) {
        postData('/addData', {date: newDate, temp: 27, content: content});
    } else {
        console.log("Error2");
    }
})*/




/* Main functions */

// Add initial data
function addEntries() {
    return new Promise((resolve, reject) => {
        postData('/addData', {date: newDate, temp: '27', content: 'Feeling good'});
        postData('/addData', {date: newDate, temp: '18', content: 'A bit colder'});
        let added = true;
        resolve(added);
    });
};

// After clicking the button: 
//read user input, check temperature, add entry, update most recent entry
function addListenerForButton() {
    let btn = document.getElementById('generate');
    btn.addEventListener('click', function() {
        let myPromise1 = new Promise(function(myResolve, myReject) {
            if (checkZipInput() && checkFeelingsInput()) {
                let urlWeather = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},es&appid=${apiKey}`;
                getTemp(urlWeather);
                //generateEntry();
                /*const promise = getTemp(urlWeather);
                promise.then((temp) => console.log('Obtained by promise: ', temp))
                .then((temp) => generateEntry(temp))
                .catch((error) => {
                    console.log('Error 5: ', error);
                }); */
                received = true;
            } else {
                console.log("Error 2 - wrong input submitted");
            }
            /*.then(postData('/addData', {date: newDate, temp: 27, content: content}));
            .catch(console.log('Error3'));*/
        })
    });
};



/* Call functions */

// Add initial data and generate most recent entry
const promiseInitial = addEntries();
promiseInitial.then((added) => {
    console.log('Initial data added successfully');
    generateMostRecentEntry(); // update HTML with most recent entry
    return added;
})
.catch((error) => {
    console.log('Error - initial promise: ', error);
});

// Add listener for 'Generate' button
addListenerForButton();