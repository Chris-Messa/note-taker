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
        res.statusCode(404).json({ message: "Sorry, the notes are missing!" });
    })
})

apiNotes.post('/api/notes', (req, res) => {

    /*
    *   Functions the same as: 
    *   const title = req.body.title;
    *   const text = req.body.text;
    */

    const { title, text } = req.body;

    // Check if title and text exist in req.body (that is, determines if they are truthy values)
    if (title && text) {

        // Defines a new note
        const newNote = { title, text, id: uuidv4() };

        // accesses the data in db.json, interpreted as a string
        fs.readFromFile(path.join(__dirname, '../../db/db.json'))
        .then((data) => {

            // assigns the mutable variable db to the data returned from the readFromFile operation and parses it into a JSON object
            let db = JSON.parse(data);
            db.push(newNote);

            // Replaces the existing db.json file with the new JSON array after pushing the new note
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

// Sets route for deleting a note based on its unique ID
apiNotes.delete('/api/notes/:id', (req, res) => {

    // assigns the constant variable id to the value of id paramater from the route URL id
    const id = req.params.id; 
    if (id) {


        fs.readFromFile(path.join(__dirname, '../../db/db.json'))
        .then((data) => {
            let db = JSON.parse(data);

            // Assigns the constant variable noteIndex to the index of the note with the matching requested id in the db array 
            const noteIndex = db.findIndex(note => note.id === id);

            // Checks if there are no notes in the array
            if (noteIndex === -1) {
                res.statusCode(404).json({ message: "No note to delete"})
            } else {
            // if there are notes, remove the note at the specified index to be deleted
            db.splice(noteIndex, 1);

            // replace the existing file with the new file that has the note deleted from the array
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

