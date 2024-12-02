const express = require('express');
const app = express();

// Set up Handlebars
app.set('view engine', 'hbs');

app.get('/update-game', (req, res) => {
    // Replace this with your database query
    const gameData = {
        title: "Hi",
        age: 12,
        about: "This is a sample game.",
        devs: "Game Dev Studio",
        pubs: "Game Pub Inc.",
        cat: "Adventure, Action",
        genres: "Role-Playing",
        tags: "Multiplayer, Open World",
        site: "https://example.com",
        ach: "Achievement 1, Achievement 2",
        supurl: "https://support.example.com",
        supemail: "support@example.com",
        windows: true,
        linux: false,
        mac: true
    };

    res.render('update', gameData); // Render the HBS file with game data
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});