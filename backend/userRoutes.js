const express = require('express');
const path = require('path');
const fs = require('fs');

module.exports = (db, upload) => {
  const router = express.Router();

  // 1. Get all users
  router.get('/', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  // 2. Get a single user
  router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(row);
    });
  });

  // 3. Create a new user
  router.post('/', upload.single('image'), (req, res) => {
    const { name, address, city, age, gender } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const sql = 'INSERT INTO users (name, address, city, image, age, gender) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [name, address, city, image, age, gender];

    db.run(sql, params, function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        name,
        address,
        city,
        image,
        age,
        gender
      });
    });
  });

  // 4. Update a user
  router.put('/:id', upload.single('image'), (req, res) => {
    const id = req.params.id;
    const { name, address, city, age, gender } = req.body;
    
    db.get('SELECT image FROM users WHERE id = ?', [id], (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: 'User not found' });

      let image = user.image;
      if (req.file) {
        image = `/uploads/${req.file.filename}`;
        if (user.image) {
          const oldImagePath = path.join(__dirname, user.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      const sql = 'UPDATE users SET name = ?, address = ?, city = ?, image = ?, age = ?, gender = ? WHERE id = ?';
      const params = [name, address, city, image, age, gender, id];

      db.run(sql, params, function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          id,
          name,
          address,
          city,
          image,
          age,
          gender
        });
      });
    });
  });

  // 5. Delete a user
  router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db.get('SELECT image FROM users WHERE id = ?', [id], (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: 'User not found' });

      db.run('DELETE FROM users WHERE id = ?', id, function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        if (user.image) {
          const imagePath = path.join(__dirname, user.image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }

        res.json({ message: 'User deleted successfully', changes: this.changes });
      });
    });
  });

  return router;
};
