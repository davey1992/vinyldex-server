const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON, validatedEntries, validatedEntry} = require('../utils/helpers');
const {schemaEntryGenre} = require('../utils/schema.js');

router.post('/add/entry-genre', async (req, res) => {
  const entryGenresResults = await validatedEntries(req.body, schemaEntryGenre);
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
      cleanedEntryGenre.entryID,
      cleanedEntryGenre.genreID
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
            log(`Invalid entryID: (${cleanedEntryGenre.entryID})  does not exist`);
            groupErrors.push(`Invalid entryID: (${cleanedEntryGenre.entryID})  does not exist`);
          break;
          case 'fk_genre_id':
            log(`Invalid genreID: (${cleanedEntryGenre.genreID}) does not exist`);
            groupErrors.push(`Invalid genreID: (${cleanedEntryGenre.genreID}) does not exist`);
          break;
          default:
            console.error('Database insert error:', err);
        }
      }
      else if (err.code === '23505') {
        if (err.constraint === 'unique_entry_id_genre_id') {
          log(`Invalid EntryGenre (entryID:${cleanedEntryGenre.entryID}, genreID:${cleanedEntryGenre.genreID}) already exists`);
          groupErrors.push(`Invalid EntryGenre (entryID:${cleanedEntryGenre.entryID}, genreID:${cleanedEntryGenre.genreID}) already exists`);
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