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
  password: 'Ybms2v75jBUfCGAFWe8D4nxh', 
  database: 'mco2_database', 
  port: 21530
});

connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit if database connection fails
  }
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
    if (err) {
      console.error('Error fetching game:', err.message);
      return res.status(500).send('Error fetching game details');
    }
    if (results.length === 0) {
      return res.status(404).send('Game not found');
    }
    res.render('update', { game: results[0] }); // Render update.hbs
  });
});

app.get('/game/:appid', (req, res) => {
  const appid = req.params.appid;
  connection.query('SELECT * FROM games WHERE appid = ?', [appid], (err, results) => {
    if (err) {
      console.error('Error fetching game details:', err.message);
      return res.status(500).send('Error fetching game details');
    }
    if (results.length === 0) {
      return res.status(404).send('Game not found');
    }
    res.render('gameDetails', { game: results[0] }); // Render gameDetails.hbs
  });
});

// Route for adding a new game
app.post('/add', (req, res) => {
  const game = {
    Name: req.body.Name,
    RequiredAge: parseFloat(req.body.RequiredAge) || 0,
    AboutGame: req.body.AboutGame,
    Developers: req.body.Developers,
    Publishers: req.body.Publishers,
    Genres: req.body.Genres,
    Website: req.body.Website,
    Achievements: parseInt(req.body.Achievements, 10) || 0,
    SupportURL: req.body.SupportURL,
    SupportEmail: req.body.SupportEmail,
    Price: parseFloat(req.body.Price) || 0,
    Windows: req.body.Windows === 'on' ? 1 : 0,
    Linux: req.body.Linux === 'on' ? 1 : 0,
    Mac: req.body.Mac === 'on' ? 1 : 0
  };

  connection.query('INSERT INTO games SET ?', game, (err) => {
    if (err) {
      console.error('Error adding game:', err.message);
      return res.status(500).send('Error adding game');
    }
    res.redirect('/');
  });
});

// Route for updating a game
app.post('/update/:appid', (req, res) => {
  const appid = req.params.appid;
  const game = {
    Name: req.body.Name,
    RequiredAge: parseFloat(req.body.RequiredAge) || 0,
    AboutGame: req.body.AboutGame,
    Developers: req.body.Developers,
    Publishers: req.body.Publishers,
    Genres: req.body.Genres,
    Website: req.body.Website,
    Achievements: parseInt(req.body.Achievements, 10) || 0,
    SupportURL: req.body.SupportURL,
    SupportEmail: req.body.SupportEmail,
    Price: parseFloat(req.body.Price) || 0,
    Windows: req.body.Windows === 'on' ? 1 : 0,
    Linux: req.body.Linux === 'on' ? 1 : 0,
    Mac: req.body.Mac === 'on' ? 1 : 0
  };

  connection.query('UPDATE games SET ? WHERE appid = ?', [game, appid], (err) => {
    if (err) {
      console.error('Error updating game:', err.message);
      return res.status(500).send('Error updating game');
    }
    res.redirect('/');
  });
});

// Route for searching games
app.post('/search', (req, res) => {
  const searchQuery = req.body.Name;
  const query = 'SELECT * FROM games WHERE Name LIKE ?';
  
  connection.query(query, [`%${searchQuery}%`], (err, results) => {
    if (err) {
      console.error('Error searching games:', err.message);
      return res.status(500).send('Error searching games');
    }
    res.json({ games: results });
  });
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
