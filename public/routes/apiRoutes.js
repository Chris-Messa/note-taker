const apiNotes = require('express').Router();
const path = require('path');
const fs = require('../../helpers/fsUtils')
const { v4: uuidv4 } = require('uuid');


// Get list of notes
apiNotes.get('/api/notes', (req, res) => {
   fs.readFromFile(path.join(__dirname, '../../db/db.json'), 'utf8')
    .then((data) => {
        const db = JSON.parse(data);
        res.json(db);
        console.log("Got notes!");
    })
    .catch(err => {
        console.error(err)
        res.status(404).json({ message: "Sorry, the notes are missing!" });
    })
})

apiNotes.post('/api/notes', (req, res) => {

    /*
    *   Functions the same as: 
    *   const title = req.body.title;
    *   const text = req.body.text;
    */
    
    const { title, text } = req.body;
    if (title && text) {
        const newNote = { title, text, id: uuidv4() };
        fs.readFromFile(path.join(__dirname, '../../db/db.json'))
        .then((data) => {
            let db = JSON.parse(data);
            db.push(newNote);
            fs.writeToFile(path.join(__dirname, '../../db/db.json'), db);
            res.status(201).json(db);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Note not saved" });
        });
    } else {
        res.status(400).json({ message: "Note needs title and text" });
    }
});

apiNotes.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id; 
    if (id) {
        fs.readFromFile(path.join(__dirname, '../../db/db.json'))
        .then((data) => {
            let db = JSON.parse(data);

            const noteIndex = db.findIndex(note => note.id === id);

            if (noteIndex === -1) {
                res.status(404).json({ message: "No note to delete"})
            } else {
            db.splice(noteIndex, 1);

            fs.writeToFile(path.join(__dirname, '../../db/db.json'), db);
            res.json({ message: "Note Deleted" })
            };
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Note could not be deleted properly"})
        })
    }
})

module.exports = apiNotes;

