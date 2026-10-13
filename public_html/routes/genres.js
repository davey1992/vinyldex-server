const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON, validatedEntries, validatedEntry} = require('../utils/helpers');
const {schemaGenre} = require('../utils/schema.js');

router.post('/add/genre', async (req, res) => {
  const genreResults = await validatedEntries(req.body, schemaGenre);
  const cleanedGenres = genreResults.entries;
  const groupErrors = genreResults.errors;

  const grammar = req.body.length == 1 ? 'Genre' : 'Genres';
  
  if (cleanedGenres.length == 0) {
    log('No ' + grammar + ' have been added');
    log(groupErrors);

    return res.status(400).json({
      success:false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: groupErrors
    });
  }

  for (const cleanedGenre of cleanedGenres) {
      const query = `
      INSERT INTO genres (
        parent_id,
        genre_name,
        genre_description
      )
      VALUES (
        $1,
        $2,
        $3
      )
      RETURNING id;
    `;
    
    const values = [
      cleanedGenre.parentID,
      cleanedGenre.genreName,
      cleanedGenre.genreDescription
    ];

    try {
      const result = await pool.query(query, values);
      log("Genre: Created - " + cleanedGenre.genreName);
      return res.status(201).json({ 
        success: true,
        message: 'Genre ' + cleanedGenre.genreName + ' created in database!', 
        data: result.rows[0]
      });
    } 
    
    catch (err) {
       if (err.code === '23503') {
        if (err.constraint === 'fk_genre_parent_id') {
          log(`Invalid parentID: (${cleanedGenre.parentID}) parent genre does not exist`);
          groupErrors.push(`Invalid parentID: (${cleanedGenre.parentID}) parent genre does not exist`);
        }
        else {
          console.error('Database insert error:', err);
        }
      }
      else if (err.code === '23505') {
        if (err.constraint === 'unique_genre_name') {
          log(`Invalid genreName: (${cleanedGenre.genreName}) already exists`);
          groupErrors.push(`Invalid genreName: (${cleanedGenre.genreName}) already exists`);
        }
        else {
          console.error('Database insert error:', err);
        }
      }
      else {
         console.error('Database insert error:', err);
      }
    }
  }

  const sendUser = returnAddJSON(req, grammar, groupErrors);
  return res.status(sendUser.status).json(
    sendUser.data
  );

});


module.exports = router;