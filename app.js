const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const app = express();

// Set up Handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
  host: 'ccscloud.dlsu.edu.ph',
  user: 'root',
  password: 'Ybms2v75jBUfCGAFWe8D4nxh',  // Replace with your MySQL password
  database: 'mco2_database',  // Replace with your database name
  port: 21530
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the database.');
});

// Routes for rendering views
app.get('/', (req, res) => {
  res.render('search');  // This will render search.hbs
});

app.get('/add', (req, res) => {
  res.render('addGame');  // This will render addGame.hbs
});

app.get('/update/:appid', (req, res) => {
  const appid = req.params.appid;
  connection.query('SELECT * FROM games WHERE appid = ?', [appid], (err, results) => {
    if (err) throw err;
    res.render('update', { game: results[0] });  // This will render update.hbs
  });
});


app.get('/search', (req, res) => {
  res.render('searchResults', { games: games });
});


// Route for handling the addition of a new game
app.post('/add', (req, res) => {
  const { title, reqAge, about, devs, pubs, categories, genres, site, ach, supurl, supemail, price, windows, linux, mac } = req.body;
  const game = {
    title,
    reqAge,
    about,
    devs,
    pubs,
    categories,
    genres,
    site,
    ach,
    supurl,
    supemail,
    price,
    windows: windows === 'on' ? 1 : 0,
    linux: linux === 'on' ? 1 : 0,
    mac: mac === 'on' ? 1 : 0
  };

  connection.query('INSERT INTO games SET ?', game, (err, result) => {
    if (err) throw err;
    res.redirect('/');  // Redirect to search page
  });
});

// Route for updating a game
app.post('/update/:appid', (req, res) => {
  const appid = req.params.appid;
  const { title, reqAge, about, devs, pubs, categories, genres, site, ach, supurl, supemail, price, windows, linux, mac } = req.body;
  const game = {
    title,
    reqAge,
    about,
    devs,
    pubs,
    categories,
    genres,
    site,
    ach,
    supurl,
    supemail,
    price,
    windows: windows === 'on' ? 1 : 0,
    linux: linux === 'on' ? 1 : 0,
    mac: mac === 'on' ? 1 : 0
  };

  connection.query('UPDATE games SET ? WHERE appid = ?', [game, appid], (err, result) => {
    if (err) throw err;
    res.redirect('/');  // Redirect to search page
  });
});

// Route for searching games
app.post('/search', (req, res) => {
  const searchQuery = req.body.title;

  connection.query('SELECT * FROM games WHERE Name LIKE ?', ['%' + searchQuery + '%'], (err, results) => {
    if (err) {
      console.log(err);
      throw err;
    }

    // Return JSON data for AJAX requests
    res.json({ games: results });
  });
});


// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
