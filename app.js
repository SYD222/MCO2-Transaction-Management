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
  res.render('search'); // Render search.hbs
});

app.get('/add', (req, res) => {
  res.render('addGame'); // Render addGame.hbs
});

app.get('/update/:appid', (req, res) => {
  const appid = req.params.appid;
  connection.query('SELECT * FROM games WHERE appid = ?', [appid], (err, results) => {
    if (err) throw err;
    res.render('update', { game: results[0] }); // Render update.hbs
  });
});

app.get('/game/:appid', (req, res) => {
  const appid = req.params.appid;
  connection.query('SELECT * FROM games WHERE appid = ?', [appid], (err, results) => {
    if (err) throw err;
    res.render('gameDetails', { game: results[0] }); // Render gameDetails.hbs for viewing game details
  });
});

// Route for adding a new game
app.post('/add', (req, res) => {
  const {
    Name,
    RequiredAge,
    AboutGame,
    Developers,
    Publishers,
    Genres,
    Website,
    Achievements,
    SupportURL,
    SupportEmail,
    Price,
    Windows,
    Linux,
    Mac
  } = req.body;

  const game = {
    Name,
    RequiredAge: parseFloat(RequiredAge),
    AboutGame,
    Developers,
    Publishers,
    Genres,
    Website,
    Achievements: parseInt(Achievements, 10),
    SupportURL,
    SupportEmail,
    Price: parseFloat(Price),
    Windows: Windows === 'on' ? 'TRUE' : 'FALSE',
    Linux: Linux === 'on' ? 'TRUE' : 'FALSE',
    Mac: Mac === 'on' ? 'TRUE' : 'FALSE'
  };

  connection.query('INSERT INTO games SET ?', game, (err, result) => {
    if (err) throw err;
    res.redirect('/'); // Redirect to the home page or search
  });
});


// Route for updating a game
app.post('/update/:appid', (req, res) => {
  const appid = req.params.appid;
  const {
    Name,
    RequiredAge,
    AboutGame,
    Developers,
    Publishers,
    Genres,
    Website,
    Achievements,
    SupportURL,
    SupportEmail,
    Price,
    Windows,
    Linux,
    Mac
  } = req.body;

  const game = {
    Name,
    RequiredAge,
    AboutGame,
    Developers,
    Publishers,
    Genres,
    Website,
    Achievements,
    SupportURL,
    SupportEmail,
    Price,
    Windows: Windows === 'on' ? 1 : 0,
    Linux: Linux === 'on' ? 1 : 0,
    Mac: Mac === 'on' ? 1 : 0
  };
  
  connection.query('UPDATE games SET ? WHERE appid = ?', [game, appid], (err, result) => {
    if (err) throw err;
    res.redirect('/'); // Redirect to the search page
  });
});

// Route for searching games
app.post('/search', (req, res) => {
  const searchQuery = req.body.Name; // Updated to match expected input key
  const query = 'SELECT * FROM games WHERE Name LIKE ?'; // Ensure table column 'Name' exists

  connection.query(query, [`%${searchQuery}%`], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    res.json({ games: results });
  });
});


// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
