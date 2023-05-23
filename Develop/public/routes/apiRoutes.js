const apiNotes = require('express').Router();
const path = require('path');
const fs = require('../../helpers/fsUtils')
const { v4: uuidv4 } = require('uuid');



apiNotes.get('/api/notes', (req, res) => {
   fs.readFromFile(path.join(__dirname, '../../db/db.json'), 'utf8')
    .then((data) => {
        const db = JSON.parse(data);
        res.json(db);
    })
})

apiNotes.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        const newNote = { title, text, id: uuidv4() };
        fs.readFromFile(path.join(__dirname, '../../db/db.json'))
        .then((data) => {
            let db = JSON.parse(data);
            if (Array.isArray(db)) {
                db.push(newNote);
              } else {
                console.error('Data in db.json is not an array');
                res.status(500).json({ message: "Internal server error" });
                return; 
              }
            fs.writeToFile(
                path.join(__dirname, '../../db/db.json'),
                db
            );
            res.status(201).json(db);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "An error occurred while saving the note" });
        });
    } else {
        res.status(400).json({ message: "Note needs a title and text" });
    }
});

module.exports = apiNotes;

