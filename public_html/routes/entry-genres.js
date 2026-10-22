const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, sanitizeColumns, buildWhereClause, validateSearchInput} = require('../utils/database-helpers');
const {constraintsEntryGenre} = require('../utils/constraints.js');
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
      groupErrors.push(...constraintsEntryGenre(err, cleanedEntryGenres));
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