/*
File:           server.js
Author:         Alex McRandal
Email:          amcranda@heidelberg.edu
Project:        CPS 342
*/

/*
This module is mainly responsible for listening to client requests and 
responding with the appropiate file or information.
*/

//Import statements
const https = require('https');         //Listening to web requests and responding
const fs = require('fs');               //Working with the local file system
const express = require('express');     //Utility package for creating server applications
const path = require('path');           //Module for creating file paths
const httpMsgs = require('http-msgs');  //Utility for responding to POST requests
const qString = require('querystring'); //Parses query strings into objects

//Create an object containing the directory for the encryption keys
const options = {
    key: fs.readFileSync(path.join(__dirname, 'keys', 'key.pem')),      //private key
    cert: fs.readFileSync(path.join(__dirname, 'keys', 'cert.pem'))     //public key
};

//Initiate a server application
const app = express();


//--------Serving Static Files


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'private')));


//End: Serving Static Files


//--------Web Page Requests--------


//Callback function when user requests the admin page
app.get('/admin/3i4UThG3Q95pEur', function(req, res){
    res.sendFile(path.join(__dirname, 'private', 'admin.html'));
});

//Callback function when the user requests the home page
app.get('/', function (req, res){
    res.sendFile(path.join(__dirname, 'public', 'webpages', 'index.html'));
});


//End: Web Page Requests


//--------CSS Requests--------


app.get('/admin/css', function (req, res){
    res.sendFile(path.join(__dirname, 'private', 'admin.css'));
});


//End: Css Requests


//--------JS Requests--------


app.get('/admin/js', function (req, res){
    res.sendFile(path.join(__dirname, 'private', 'admin.js'));
});


//End: JS Requests


//--------POST Request--------

app.post('/admin/user/oEiUbnge8ty3498HeiurGh3497tye9iuRh', function (req, res){
    let data = '';
    req.on('data', function(chunk) {
        data += chunk;
    });

    req.on('end', function(){
        let dataObj = qString.parse(data);

        if (dataObj.username == 'admin' && dataObj.password == 'admin'){
            res.sendFile(path.join(__dirname, 'private', 'adminUser.html'));
        }
        else{
            //TODO: Send error msg
        }
    });
});


//End: POST Request


//Create a server listening on port 443 and tell the admin the server started
https.createServer(options, app).listen(443, () => console.log("Server started on port 443..."));