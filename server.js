// import the express package
const express = require("express")
const path = require("path")
const fs = require("fs")

const PORT = process.env.PORT || 3001;

// Initialize our app variable by setting it to the value of express()
const app = express()

// middleware to parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 2 GET HTML Routes,
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// 2 API Routes: GET API, POST API below.

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        const newNote = JSON.parse(data)
        res.json(newNote)
        if (err) throw err;
    });
});

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

// GET Wildcard route 
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);


// app.listen(PORT below
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
