const htmlNotes = require('express').Router();
const path = require('path');
htmlNotes.get('/', (req, res) => {
    console.log('user got the resource');
    res.sendFile(path.join(__dirname, '../index.html'))
})

htmlNotes.get('/notes', (req, res) => {
    console.log('notes page!');
    res.sendFile(path.join(__dirname, '../notes.html'));
})

module.exports = htmlNotes;