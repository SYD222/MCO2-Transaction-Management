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

// MySQL connection configuration
const dbConfig = {
  host: 'ccscloud.dlsu.edu.ph',
  user: 'root',
  password: 'Ybms2v75jBUfCGAFWe8D4nxh', // Replace with your MySQL password
  database: 'mco2_database', // Replace with your database name
};

// Ports to attempt connection
const ports = [21530, 21540, 21550];
let currentPortIndex = 0;
let connection = null;

// Function to connect to the database
function connectToDatabase() {
  const port = ports[currentPortIndex];
  console.log("Attempting to connect to the database on port ${port}...");

  connection = mysql.createConnection({ ...dbConfig, port });

  connection.connect(err => {
    if (err) {
      console.error("Connection failed on port ${port}:", err.message);
      currentPortIndex = (currentPortIndex + 1) % ports.length; // Move to the next port
      console.log("Retrying with the next port...");
      setTimeout(connectToDatabase, 5000); // Retry after a delay
    } else {
      console.log("Connected to the database on port ${port}.");
      handleConnectionLoss(); // Set up a handler for connection loss
    }
  });
}

// Function to handle connection loss
function handleConnectionLoss() {
  connection.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection lost. Reconnecting...');
      connectToDatabase();
    } else {
      throw err;
    }
  });
}

// Start the initial connection
connectToDatabase();

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:${PORT}");
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
    res.render('update', { game: results[0] });
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
