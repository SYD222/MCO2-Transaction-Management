// Import required modules
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();
const port = 9090;

// Set up view engine and middleware
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample game data (for demonstration purposes)
let games = [
    {
        appid: "101",
        title: "Game One",
        requiredAge: 0,
        price: "$19.99",
        about: "An exciting adventure game.",
        website: "https://gameone.com",
        supportUrl: "https://support.gameone.com",
        supportEmail: "support@gameone.com",
        windows: true,
        mac: true,
        linux: false,
        achievements: 100,
        developers: ["Developer A"],
        publishers: ["Publisher A"],
        genres: ["Adventure", "RPG"]
    },
    {
        appid: "102",
        title: "Game Two",
        requiredAge: 18,
        price: "$29.99",
        about: "A thrilling action-packed game.",
        website: "https://gametwo.com",
        supportUrl: "https://support.gametwo.com",
        supportEmail: "support@gametwo.com",
        windows: true,
        mac: false,
        linux: true,
        achievements: 50,
        developers: ["Developer B"],
        publishers: ["Publisher B"],
        genres: ["Action", "Shooter"]
    }
];

// Routes

// Render the search page
app.get('/', (req, res) => {
    res.render('search');
});

// Handle search functionality
app.post('/', (req, res) => {
    const { title } = req.body;

    // Find games that match the search query
    const matchingGames = games.filter(g =>
        g.title.toLowerCase().includes(title.toLowerCase())
    );

    res.json({ games: matchingGames });
});

// Render the add game page
app.get('/add', (req, res) => {
    res.render('addGame');
});

// Handle adding a new game
app.post('/add', (req, res) => {
    const newGame = req.body;

    // Assign a unique appid to the new game
    newGame.appid = String(games.length + 1);

    // Add the new game to the array
    games.push(newGame);

    res.json({ message: "Game added successfully!", game: newGame });
});

// Render the update game page
app.get('/update', (req, res) => {
    res.render('update', { games });
});

// Handle game updates
app.post('/update', (req, res) => {
    const { appid, updatedData } = req.body;

    // Find the game by appid and update its properties
    const gameIndex = games.findIndex(g => g.appid === appid);
    if (gameIndex !== -1) {
        games[gameIndex] = { ...games[gameIndex], ...updatedData };
        res.json({ message: "Game updated successfully!", game: games[gameIndex] });
    } else {
        res.status(404).json({ message: "Game not found." });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
