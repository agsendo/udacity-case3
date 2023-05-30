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
app.get('/', sendData);
function sendData (req, res) {
    res.send('projectData');
};

/*
// POST an animal
//const data = [];
app.post('/animal', addAnimal);

function addAnimal (req,res){
    let data = req.body;
    projectData["animalX"] = data.animal;
    res.send(projectData);

    /*working alternative
    const animal = req.body.animal;
    projectData.animal = animal;
    console.log(projectData.animal);
    //res.send('POST received'); // error - we should use json
    res.json({ message: 'POST received' }); // will appear in the browser's console
    */

    /*working alternative
    projectData.animal = req.body;
    console.log('Received new animal: ', req.body);
    //res.send('POST received'); // error - we should use json
    res.json({ message: 'POST received' }); // will appear in the browser's console
    */

    /* working alternative
    projectData = req.body;
    console.log('Received new animal: ', projectData); // will appear in the text editor terminal
    //res.send("POST received"); // error - we should use json
    res.json({ message: 'POST received' }); // will appear in the browser's console
    */
/*};
*/
