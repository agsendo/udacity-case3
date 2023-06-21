/* Empty JS object to act as endpoint for all routes; 
stores entries-objects with properties: date, temperature, feelings */
let projectData = {};

/* Count added entries inside projectData object */
let counter = 0;

/* Array for storing all of the entries */
//let entries = [];


/* Express to run server and routes */
const express = require('express');

/* Start up an instance of app */
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');
/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
const cors = require('cors');
app.use(cors());

//const fetch = require('node-fetch');

/* Initialize the main project folder*/
app.use(express.static('website'));

const port = 8000;
/* Spin up the server*/
const server = app.listen(port, listening);
function listening(){
    //console.log(server);
    console.log(`running on localhost: ${port}`);
};



// GET route
app.get('/getData', sendData);
// Send projectData object with all the stored data
function sendData (req, res) {
    res.send(projectData);
};

app.get('/getRecent', sendRecent);
// Send the last added data
function sendRecent (req, res) {
    let last = projectData[`entry${counter-1}`];
    console.log('Last entry from GET: ', last);
    console.log('Last temp from GET: ', last.temp);
    res.send(last);
};


// POST route
app.post('/addData', addData);
function addData (req, res) {
    let { date, temp, content } = req.body;
    let newEntry = { date, temp, content };
    //entries.push(newEntry); //add the new entry to the array
    console.log('Added entry: ', newEntry);
    //console.log('Array: ', entries);
    projectData[`entry${counter}`] = newEntry;
    counter += 1;
    console.log('projectData: ', projectData);
    res.json({ message: 'Entry received' });
}