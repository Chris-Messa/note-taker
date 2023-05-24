const htmlNotes = require('express').Router();
const path = require('path');

// Route for root page get request
htmlNotes.get('/', (req, res) => {
    console.log('user got the resource');
    res.sendFile(path.join(__dirname, '../index.html'))
})

// Route for the notes page get request
htmlNotes.get('/notes', (req, res) => {
    console.log('notes page!');
    res.sendFile(path.join(__dirname, '../notes.html'));
})

module.exports = htmlNotes;