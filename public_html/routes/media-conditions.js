const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, validatedUpdates, buildSetClause, sanitizeColumns, buildWhereClause, validateSearchInput} = require('../utils/database-helpers');
const {constraintsMediaCondition} = require('../utils/constraints.js');
const {schemaMediaCondition} = require('../utils/schema.js');

router.post('/add/media-condition', async (req, res) => {
  const cleanedMediaConditions = await validatedInserts(req.body, schemaMediaCondition());
  const cleanMediaConditions = cleanedMediaConditions.entries;
  const groupErrors = cleanedMediaConditions.errors;

  const grammar = req.body.length == 1 ? 'Media Condition' : 'Media Conditions';

  if (cleanMediaConditions.length == 0) {
    log('No ' + grammar + ' have been added');
    log(groupErrors);

    return res.status(400).json({
      success:false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: groupErrors
    });
  }

  for (const cleanMediaCondition of cleanMediaConditions) {
    const query = `
      INSERT INTO media_conditions (
        condition,
        description
      )
      VALUES (
        $1,
        $2
      )
      RETURNING id;
    `;
    
    const values = [
      cleanMediaCondition.condition,
      cleanMediaCondition.description,
    ];

    try {
      const result = await pool.query(query, values);
      log("Entry: Created - " + cleanMediaCondition.condition);
    } 
    catch (err) {
      groupErrors.push(...constraintsMediaCondition(err, cleanMediaConditions));
    }
  }

  const sendUser = returnAddJSON(req, grammar, groupErrors);
  return res.status(sendUser.status).json(
    sendUser.data
  );
});

router.post('/read/media-conditions', async (req, res) => {
  const result = await basicReadTemplate(req, res, schemaMediaCondition, 'media_conditions', true);
  console.log(result.data);
});


router.post('/update/media-condition', async (req, res) => {
  const entryResults = await validatedUpdates(req.body, schemaMediaCondition(true));
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
    const setClause = buildSetClause(entryResult, schemaMediaCondition());

    const searchCriteria = await validateSearchInput(entryResults.search[i], schemaMediaCondition(true));
    const whereClause = buildWhereClause(searchCriteria, setClause.values.length);

    const query = `UPDATE media_conditions SET ${setClause.query} WHERE TRUE ${whereClause.query}`;
    const values = [...setClause.values, ...whereClause.values];

    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        groupErrors.push(`${grammar} not found with the given search criteria`)
      }
    } 
    catch (err) {
      groupErrors.push(...constraintsMediaCondition(err, entryResult));
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