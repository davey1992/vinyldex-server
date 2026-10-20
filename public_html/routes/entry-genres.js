const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, sanitizeColumns, validatedQuerySearch, validatedSearchJSON} = require('../utils/database-helpers');
const {schemaEntryGenre} = require('../utils/schema.js');

router.post('/add/entry-genre', async (req, res) => {
  const entryGenresResults = await validatedInserts(req.body, schemaEntryGenre());
  const cleanedEntryGenres = entryGenresResults.entries;
  const groupErrors = entryGenresResults.errors;

  const grammar = req.body.length == 1 ? 'Genre' : 'Genres';

  if (cleanedEntryGenres.length == 0) {
    log('No ' + grammar + ' have been added');
    log(groupErrors);

    return res.status(400).json({
      success:false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: groupErrors
    });
  }
  for (const cleanedEntryGenre of cleanedEntryGenres) {
    const query = `
      INSERT INTO entry_genres (
        entry_id,
        genre_id
      )
      VALUES (
        $1,
        $2
      )
      RETURNING id;
    `;
    const values = [
      cleanedEntryGenre.entry_id,
      cleanedEntryGenre.genre_id
    ];

    try {
      const result = await pool.query(query, values);
      log("Entry Genre: Created - ");
    } 
    catch (err) {
      //FORIGN KEY VALIDATION ISSUES
      if (err.code === '23503') {    
        switch (err.constraint) {
          case 'fk_entry_id':
            log(`Invalid entry_id: (${cleanedEntryGenre.entry_id})  does not exist`);
            groupErrors.push(`Invalid entry_id: (${cleanedEntryGenre.entry_id})  does not exist`);
          break;
          case 'fk_genre_id':
            log(`Invalid genre_id: (${cleanedEntryGenre.genre_id}) does not exist`);
            groupErrors.push(`Invalid genre_id: (${cleanedEntryGenre.genre_id}) does not exist`);
          break;
          default:
            console.error('Database insert error:', err);
        }
      }
      else if (err.code === '23505') {
        if (err.constraint === 'unique_entry_id_genre_id') {
          log(`Invalid entry_genre (entry_id:${cleanedEntryGenre.entry_id}, genre_id:${cleanedEntryGenre.genre_id}) already exists`);
          groupErrors.push(`Invalid entry_genre (entry_id:${cleanedEntryGenre.entry_id}, genre_id:${cleanedEntryGenre.genre_id}) already exists`);
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

router.post('/read/entry-genre', async (req, res) => {
  const result = await basicReadTemplate(req, res, schemaEntryGenre, 'entry_genres', false);
  console.log(result.data);
});



module.exports = router;