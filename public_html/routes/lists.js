const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, validatedUpdates, buildSetClause, sanitizeColumns, buildWhereClause, validateSearchInput} = require('../utils/database-helpers');
const {constraintsList} = require('../utils/constraints.js');
const {schemaList} = require('../utils/schema.js');

router.post('/add/list', async (req, res) => {
  const listResults = await validatedInserts(req.body, schemaList());
  const cleanedLists = listResults.entries;
  const groupErrors = listResults.errors;

  const grammar = req.body.length == 1 ? 'List' : 'Lists';
  
  if (cleanedLists.length == 0) {
    log('No ' + grammar + ' have been added');
    log(groupErrors);

    return res.status(400).json({
      success: false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: groupErrors
    });
  }

  for (const cleanedList of cleanedLists) {
    const query = `
      INSERT INTO lists (
        user_id,
        name, 
        description, 
        type,
        is_public,
        state,
        properties
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
      )
      RETURNING id;
    `;
    
    const values = [
      cleanedList.user_id,
      cleanedList.name,
      cleanedList.description,
      cleanedList.type,
      cleanedList.is_public,
      cleanedList.state,
      cleanedList.properties
    ];

    log(values);

    try {
      const result = await pool.query(query, values);
      log("List: Created - " + cleanedList.name);
    } 
    catch (err) {
      groupErrors.push(...constraintsList(err, cleanedList));
    }
  }

  const sendUser = returnAddJSON(req, grammar, groupErrors);
  return res.status(sendUser.status).json(sendUser.data);
});

router.post('/read/lists', async (req, res) => {
  const result = await basicReadTemplate(req, res, schemaList, 'lists', false);
  console.log(result.data);
});


router.post('/update/list', async (req, res) => {
  const entryResults = await validatedUpdates(req.body, schemaList(true));
  const grammar = entryResults.values.length == 1 ? 'List' : 'Lists';
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
    const setClause = buildSetClause(entryResult, schemaList());
    
  

    const searchCriteria = await validateSearchInput(entryResults.search[i], schemaList(true));
  
    const whereClause = buildWhereClause(searchCriteria, setClause.values.length);

    const query = `UPDATE lists SET ${setClause.query} WHERE TRUE ${whereClause.query}`;
    const values = [...setClause.values, ...whereClause.values];

    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        groupErrors.push(`${grammar} not found with the given search criteria`)
      }
    } 
    catch (err) {
      groupErrors.push(...constraintsList(err, entryResult));
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