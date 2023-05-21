const apiNotes = require('express').Router();
const db = require('../../db/db.json')
const path = require('path');

apiNotes.get('/api/notes', (req, res) => {
    res.json(db);
})

module.exports = apiNotes;

