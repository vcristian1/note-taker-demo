const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

//Middleware to parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 2 GET HTML Routes,
// GET /notes route to return notes.html
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);
// GET Wildcard route to direct users to index.html
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// 2 API Routes: GET API, POST API below.

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        const notesFromFile = JSON.parse(data)
        res.json(notesFromFile)
    })
})

app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuid();
        notes.push(newNote);

        const createNote = JSON.stringify(notes);
        fs.writeFile(path.join(__dirname, "./db/db.json"), createNote, (err) => {
            if (err) throw err;
        });
        res.json(newNote);
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteID = req.params.id;
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const notesArray = notes.filter( item => {
            return item.id !==  noteID
        });
        fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err, data) => {
            if (err) throw err;
            res.json(notesArray)
        });
    });
});

// app.listen(PORT below
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
