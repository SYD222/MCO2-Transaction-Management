// import module `express`
const express = require('express');

// import module `hbs`
const hbs = require('hbs');
const app = express();
const port = 9090;
app.set('view engine', 'hbs');
// Serve the search page
app.get('/', (req, res) => {
    res.render('search'); // Render the matches.hbs file
});
app.get('/add', (req, res) => {
    res.render('addGame'); // Render the matches.hbs file
});
app.get('/update', (req, res) => {
    res.render('update', gamedata); // Render the matches.hbs file
});
// Handle search requests at "/"
app.post('/', (req, res) => {
    const { title } = req.body;

    // Find all games matching the title (case-insensitive search)
    const matchingGames = games.filter(g => g.title.toLowerCase().includes(title.toLowerCase()));

    // Respond with JSON for AJAX requests
    res.json({ games: matchingGames });
});

app.listen(port, ()=>{
	console.log('Server on '+ port);
});