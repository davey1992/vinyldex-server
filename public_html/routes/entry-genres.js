const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, validatedUpdates, buildSetClause, sanitizeColumns, buildWhereClause, validateSearchInput} = require('../utils/database-helpers');
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


router.post('/update/entry-genre', async (req, res) => {
  const entryResults = await validatedUpdates(req.body, schemaEntryGenre(true));
  const grammar = entryResults.values.length == 1 ? 'Entry Genre' : 'Entry Genres';
  const groupErrors = entryResults.errors;

  if (entryResults.values.length == 0) {
    log('No ' + grammar + ' have been added');
    log(entryResults.errors);

    return res.status(400).json({
      success:false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: entryResults.errors
    });
  }

  const entryPromise = entryResults.values.map(async (entryResult, i) => {
    const setClause = buildSetClause(entryResult, schemaEntryGenre());

    const searchCriteria = await validateSearchInput(entryResults.search[i], schemaEntryGenre(true));
    const whereClause = buildWhereClause(searchCriteria, setClause.values.length);

    const query = `UPDATE entry_genres SET ${setClause.query} WHERE TRUE ${whereClause.query}`;
    const values = [...setClause.values, ...whereClause.values];

    console.log(query);
    console.log(req.body);
    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        groupErrors.push(`${grammar} not found with the given search criteria`)
      }
    } 
    catch (err) {
      groupErrors.push(...constraintsEntryGenre(err, entryResult));
    }
  });
  await Promise.all(entryPromise);

  if (groupErrors.length > 0) {
    let countString = "Some";

    if (groupErrors.length == entryResults.values.length) {
      countString = "All";
    }

    log(`${countString} ${grammar.toLowerCase()} did not update: see errors below for more details`);
    log(groupErrors);

    return res.status(400).json({
      success: false,
      type: 'database_error',
      message: `${countString} ${grammar.toLowerCase()} did not update: see errors below for more details`,
      errors: groupErrors
    });
  }
});


module.exports = router;