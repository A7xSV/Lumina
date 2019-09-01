const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('request');

// Create connection with database luminaTest
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'luminaTest'
});

// Connect to database and log success
db.connect((err) => {
    if (err) {
        // Return server error
        res.status(500).json({error: 'Failed connecting to database'});
        throw err;
    }
    console.log('Connected to DB!');
});

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// Set headers to allow all origins and HTTP requests during development
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

// Create database with name passed in as url parameter 'dbName' (Used once to create luminaTest database)
app.post('/createDB', (req, res) => {
    if (!req.query.dbName) {
        res.status(400).json({error: 'Missing dbName param'});
        return;
    }
    const query = `CREATE DATABASE ${req.query.dbName}`;
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(400).json({error: err.sqlMessage});
            return;
        }
        else {
            console.log(result);
            res.status(201).json({success: 'Database created'});
        }
    });
});

// Create table with name passed in as url parameter 'tableName'
app.get('/createTable', (req, res) => {
    if (!req.query.tableName) {
        res.status(400).json({error: 'Missing tableName param'});
        return;
    }
    const query = `CREATE TABLE ${req.query.tableName} (
        id int(11) NOT NULL AUTO_INCREMENT,
        firstName varchar(255) default NULL,
        lastName varchar(255) default NULL,
        email varchar(255) default NULL UNIQUE,
        password varchar(255) default NULL,
        favourite_movies varchar(255) default NULL,
        PRIMARY KEY(id)
    );`;
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(400).json({error: err.sqlMessage});
            return;
        }
        // console.log(result);
        res.status(201).json({success: 'Table users created'});
    });
});

// Initial values to insert based on the dump provided
app.get('/insertInitial', (req, res) => {
    const query = `INSERT INTO users (firstName,lastName,email,password,favourite_movies)
        VALUES
            ('Anona','Cruz','anona.cruz@test.com','password','tt0848228,tt4154756,tt2395427,tt4154796'),
            ('Camilla','Sayer','camilla.sayer@test.com','password','tt4154756,tt10515848,tt0120575'),
            ('Ganesh','Zentai','ganesh.zentai@test.com','password','tt0287871,tt2975590,tt0103776,tt4116284,tt2313197'),
            ('Vivien','Straub','vivien.straub@test.com','password','tt0926084,tt0417741'),
            ('Bernardita','Bishop', 'bernardita.bishop@test.com','password','tt0389860');`;
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(400).json({error: err.sqlMessage});
            return;
        }
        console.log(result);
        res.status(201).json({success: 'Inserted values'});
    });
});

/* 
    Create a new user with params passed in POST request body:
        - firstName: string
        - lastName: string
        - email: string
        - password: string
*/
app.post('/user/signup', (req, res, next) => {
    if (req.body.password.trim() == '') {
        res.status(400).json({error: 'Signup failed'});
    }

    // Check if email exists
    bcrypt.hash(req.body.password, 10).then(hash => {
        const query = `INSERT INTO users (firstName,lastName,email,password,favourite_movies) VALUE 
            ('${req.body.firstName}','${req.body.lastName}','${req.body.email}','${hash}','');`;
        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({error: err.sqlMessage});
                return;
            }
            // console.log(result);
            res.status(201).json({success: 'User created'});
        });
    });
});

/* 
    Authenticate user with params passed in POST request body: 
        - email
        - password
    Use 'password' for the initial ones added manually
*/
app.post('/user/login', (req, res, next) => {
    const query = `SELECT * FROM users WHERE email='${req.body.email}';`;
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(401).json({error: err.sqlMessage});
            return;
        }
        // console.log(result);
        const userExists = result.length !== 0;
        if (!userExists) {
            // User with email entered not found in database
            res.status(401).json({error: 'User does not exist'});
            return;
        }
        const initialUsers = ['anona.cruz@test.com','camilla.sayer@test.com','ganesh.zentai@test.com','vivien.straub@test.com','bernardita.bishop@test.com'];
        if (initialUsers.indexOf(result[0].email) !== -1 && req.body.password == 'password') {
            // If initially inserted user from dump logs in with password 'password'
            const token = jwt.sign(
                { email: result[0].email, userId: result[0].id },
                "secret_key",
                { expiresIn: "1h" }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: result[0].id,
                firstName: result[0].firstName,
                lastName: result[0].lastName,
                favourites: result[0].favourite_movies.split(',')
            });
            return;
        }
        bcrypt.compare(req.body.password, result[0].password)
            .then(isUser => {
                if (!isUser) {
                    // User exists but incorrect password entered
                    throw new Error('Did not match');
                }
                const token = jwt.sign(
                    { email: result[0].email, userId: result[0].id },
                    "secret_key",
                    { expiresIn: "1h" }
                );
                res.status(200).json({
                    token: token,
                    expiresIn: 3600,
                    userId: result[0].id,
                    firstName: result[0].firstName,
                    lastName: result[0].lastName,
                    favourites: result[0].favourite_movies.split(',')
                });
            })
            .catch(err => {
                res.status(401).json({error: 'Incorrect password'});
                return;
            });
    });
});

// Get all unique movies in the database
app.get('/movies', (req, res) => {
    const query = 'SELECT favourite_movies FROM users';
    db.query(query, (err, result, fields) => {
        if (err) {
            console.error(err);
            res.status(400).json({error: err.sqlMessage});
            return;
        }
        // console.log(result);
        uniqueElements = [];
        for (let i = 0; i < result.length; i++) {
            // console.log(result[i].favourite_movies);
            let favouriteMovies = result[i].favourite_movies.split(',');
            favouriteMovies.forEach(element => {
                if (uniqueElements.indexOf(element) === -1 && element != '') {
                    // If element not already present in uniqueElements array, push it to be returned
                    uniqueElements.push(element);
                }
            });
        }
        // console.log(uniqueElements)
        res.status(201).json({data: uniqueElements});
    });
});

// Get favourite movies for 'userId' passed in PUT request body
app.put('/favourites', (req, res) => {
    var newFavourites = '';
    if (req.body.favourites.length > 0) {
        // Favourites present, convert all favourites to ',' separated string
        newFavourites = req.body.favourites.join(',') != ',' ? req.body.favourites.join(',') : '';
    }
    else {
        // No favourites, set to empty string
        newFavourites = '';
    }
    const query = `UPDATE users SET favourite_movies='${newFavourites}' WHERE id='${req.body.userId}'`;
    console.log(query);
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({error: err.sqlMessage});
            return;
        }
        console.log(result);
        res.status(201).json({success: 'favourites updated'});
    });
});

// Get movie data from OMDB API with passed in 'id' URL parameter
app.get('/movieData', (req, res) => {
    request('http://www.omdbapi.com/?apikey=99cd0e8f&i=' + req.query.id, function (error, response, body) {
        console.log('error:', error);
        res.status('200').json(JSON.parse(body));
    });
});

// Get movie trailer from myapifilms api with passed in 'id' URL parameter
app.get('/movieTrailer', (req, res) => {
    request('https://www.myapifilms.com/imdb/idIMDB/?token=54c6a6fe-1342-4fc7-af8e-b835152d4bd7&format=json&language=en-us&trailers=1&idIMDB=' + req.query.id, function (error, response, body) {
        console.log('error:', error);
        res.status('200').json(JSON.parse(body));
    });
});

// Initiate server on http://localhost:3000
app.listen('3000', () => {
    console.log('Server started on port 3000');
});