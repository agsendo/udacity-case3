/* Empty JS object to act as endpoint for all routes */
let projectData = {};

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
app.get('/get', sendData);
function sendData (req, res) {
    res.send(projectData);
};


// POST route
let entries = []; //for storing all the entries
app.post('/post', addData);
function addData (req, res) {
    let { date, temp, content } = req.body;
    let newEntry = { date, temp, content } = { date, temp, content };
    entries.push(newEntry); //add the new entry to the array
    console.log('Added entry: ', newEntry);
    console.log('Array: ', entries);
    res.json({ message: 'Entry received' });
}