const express = require('express');
const fs = require('fs');
const path = require('path');
const generateUniqueId = require('./helpers/uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API Routes
// GET route for /api/notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
      if (err) throw err;
      res.json(JSON.parse(data));
    });
  });
  
  // POST route for /api/notes
  app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: generateUniqueId() };
  
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      notes.push(newNote);
  
      fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 2), (err) => {
        if (err) throw err;
        res.json(newNote);
      });
    });
  });
  
  // DELETE route for /api/notes/:id (Bonus)
  app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
  
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
      if (err) throw err;
      let notes = JSON.parse(data);
      notes = notes.filter((note) => note.id !== noteId);
  
      fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 2), (err) => {
        if (err) throw err;
        res.json({ msg: `Note with id ${noteId} has been deleted.` });
      });
    });
  });

// HTML Routes
// Route to serve notes.html on the /notes path
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
  });
  
  // Catch-all route to serve index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
