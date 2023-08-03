const express = require('express');
const app = express();
const router = express.Router();
const pg = require('pg') //import just what we need

const pool = new pg.Pool({
    //the name of the database, unique to specific app
    database: 'music_library',
    //where is your database? localhost === On your computer
    host: 'localhost',
    //Postgres listes for network connetion on port 5432, by default
    port: 5432
})
// Parse the request body, required for req.body
// NOTE: This was previously bodyParser.json(), express
// now supports parsing json without needing bodyParser.
app.use(express.json());

// Serve "static assets" (html, css, client-side js)
// from the server/public folder
app.use(express.static('server/public'));

// Setup the songs router
// to respond to requests from the `/songs` URL
let songsRouter = require('./routes/songs.router');
app.use('/songs', songsRouter);

// Start express
const PORT = 5001;
app.listen(PORT, () => {
    console.log('up and running on port', PORT);
});

app.get('/database' , (req, res) => {
    let queryText = 'SELECT * FROM songs;';
pool.query(queryText)
    .then((result) => {
        res.send(result.rows);
    })
    .catch((err) => {
        console.log(`Error making query ${queryText}`,err);
        res.sendStatus(500)
    })
})
