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
}

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
        console.log('Error 1 - post data', error);
        // appropriately handle the error
    }
}

// Automatically generate the most recent entry when the page is loaded,
// or update most recent entry after new one is added by user
function mostRecentEntry() {
    //fetch('/getData')
    fetch('/getRecent')
    .then (response => response.json())
    .then(data => {
        //let lastEntry = data.entry1;
        let lastEntry = data;
        console.log('Last entry: ', lastEntry);
        let dateRecent = lastEntry.date;
        console.log('Date-recent: ', dateRecent);
        let tempRecent  = lastEntry.temp;
        console.log('Temp-recent: ', tempRecent);
        let feelRecent = lastEntry.content;
        console.log('Feelings-recent: ', feelRecent);
        let divRecent = 
            `<div id="date">Date: ${dateRecent}</div> 
            <div id="temp">Temperature: ${tempRecent} C</div>
            <div id="content">Feelings: ${feelRecent}</div>`;
        let holder = document.getElementById('entryHolder');
        holder.innerHTML = divRecent;
    })

    /*let lastEntry = projectData[1];
    console.log('Last entry: ', lastEntry);
    let dateRecent = lastEntry.date;
    console.log('Date-recent: ', dateRecent);
    //let tempRecent 
    let divRecent = 
    `<div id="date">Date: ${dateRecent}</div> `;
    let holder = document.getElementById('entryHolder');
    holder.innerHTML = divRecent;
    */
}

function updateMostRecentEntry() {
    let divRecent = 
    `<div id="date">Date: ${newDate}</div> 
    <div id="temp">Temperature: ${temp} C</div>
    <div id="content">Feelings: ${content}</div>`;

    let holder = document.getElementById('entryHolder');
    holder.innerHTML = divRecent;
}


async function getTemp(url) {
    try {
        const response = await fetch(url);

        /*var data = await response.json();
        tempByZip = data.main.temp.toFixed(1);
        console.log("data obtained: ", tempByZip);
        temp = tempByZip;
        generateEntry();
        */
        if (!response.ok) {
            throw new Error('Error 3: ', response.status);
        }
        var data = await response.json();
        temp = data.main.temp.toFixed(1);
        console.log('data obtained: ', temp);
        generateEntry();
        return temp;
    } catch (error) {
        console.log('Error 4: ', error);
    }
}



//Add listener for 'Generate' button
function addListenerForButton() {
    let btn = document.getElementById('generate');
    btn.addEventListener('click', function() {
        let myPromise1 = new Promise(function(myResolve, myReject) {
            if (checkZipInput() && checkFeelingsInput()) {
                let urlWeather = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},es&appid=c4118ac8f4fdbfee310a33ce3167101b&units=metric`;
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
                console.log("Error 2 - wrong input");
            }
            /*.then(postData('/addData', {date: newDate, temp: 27, content: content}));
            .catch(console.log('Error3'));*/
        })
    });
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
}







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
function addEntries() {
    return new Promise((resolve, reject) => {
        postData('/addData', {date: newDate, temp: '27', content: 'Feeling good'});
        postData('/addData', {date: newDate, temp: '18', content: 'A bit colder'});
        let added = true;
        resolve(added);
    });
}

const promise2 = addEntries();
promise2.then((added) => {
    console.log('Data added');
    return added;
})
.then((added) => mostRecentEntry())
.catch((error) => {
    console.log('Error 6: ', error);
});


// Fill div with most recent entry
//mostRecentEntry();

// After clicking the button: 
//read user input, check temperature, add entry, update most recent entry
addListenerForButton();