const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, validatedUpdates, buildSetClause, sanitizeColumns, buildWhereClause, validateSearchInput} = require('../utils/database-helpers');
const {constraintsGenre} = require('../utils/constraints.js');
const {schemaGenre} = require('../utils/schema.js');

router.post('/add/genre', async (req, res) => {
  const genreResults = await validatedInserts(req.body, schemaGenre());
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
      cleanedGenre.parent_id,
      cleanedGenre.genre_name,
      cleanedGenre.genre_description
    ];

    try {
      const result = await pool.query(query, values);
      log("Genre: Created - " + cleanedGenre.genre_name);
      return res.status(201).json({ 
        success: true,
        message: 'Genre ' + cleanedGenre.genre_name + ' created in database!', 
        data: result.rows[0]
      });
    } 
    
    catch (err) {
       groupErrors.push(...constraintsGenre(err, cleanedGenre));
    }
  }

  const sendUser = returnAddJSON(req, grammar, groupErrors);
  return res.status(sendUser.status).json(
    sendUser.data
  );

});

router.post('/read/genre', async (req, res) => {
  const result = await basicReadTemplate(req, res, schemaGenre, 'genres', true);
  console.log(result.data);
});


router.post('/update/genre', async (req, res) => {
  const entryResults = await validatedUpdates(req.body, schemaGenre(true));
  const grammar = entryResults.values.length == 1 ? 'Genre' : 'Genres';
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
    const setClause = buildSetClause(entryResult, schemaGenre());

    const searchCriteria = await validateSearchInput(entryResults.search[i], schemaGenre(true));
    const whereClause = buildWhereClause(searchCriteria, setClause.values.length);

    const query = `UPDATE genres SET ${setClause.query} WHERE TRUE ${whereClause.query}`;
    const values = [...setClause.values, ...whereClause.values];

    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        groupErrors.push(`${grammar} not found with the given search criteria`)
      }
    } 
    catch (err) {
      groupErrors.push(...constraintsGenre(err, entryResult));
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