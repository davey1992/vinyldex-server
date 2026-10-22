const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, validatedUpdates, buildSetClause, sanitizeColumns, buildWhereClause, validateSearchInput} = require('../utils/database-helpers');
const {constraintsRelationship} = require('../utils/constraints.js');
const {schemaRelationship} = require('../utils/schema.js');

router.post('/add/relationship', async (req, res) => {
  const relationshipResults = await validatedInserts(req.body, schemaRelationship());
  const cleanedRelationships = relationshipResults.entries;
  const groupErrors = relationshipResults.errors;

  const grammar = req.body.length == 1 ? 'Relationship' : 'Relationships';

  if (cleanedRelationships.length == 0) {
    log('No ' + grammar + ' have been added');
    log(groupErrors);

    return res.status(400).json({
      success: false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: groupErrors
    });
  }

  for (const cleanRelationship of cleanedRelationships) {
    const query = `
      INSERT INTO relationships (
        user_id,
        target_user_id, 
        relationship_types
      )
      VALUES (
        $1,
        $2,
        $3
      )
      RETURNING id;
    `;
    
    const values = [
      cleanRelationship.user_id,
      cleanRelationship.target_user_id,
      cleanRelationship.relationship_types
    ];

    try {
      const result = await pool.query(query, values);
      log("Relationship: Created - " + cleanRelationship.user_id + ' - ' + cleanRelationship.target_user_id);
    } 
    catch (err) {
      groupErrors.push(...constraintsRelationship(err, cleanRelationship));
    }
  }

  const sendUser = returnAddJSON(req, grammar, groupErrors);
  return res.status(sendUser.status).json(sendUser.data);
});

router.post('/read/relationships', async (req, res) => {
  const result = await basicReadTemplate(req, res, schemaRelationship, 'relationships', false);
  console.log(result.data);
});

router.post('/update/relationship', async (req, res) => {
  const entryResults = await validatedUpdates(req.body, schemaRelationship(true));
  const grammar = entryResults.values.length == 1 ? 'Relationship' : 'Relationships';
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
    const setClause = buildSetClause(entryResult, schemaRelationship());
    
  

    const searchCriteria = await validateSearchInput(entryResults.search[i], schemaRelationship(true));
    const whereClause = buildWhereClause(searchCriteria, setClause.values.length);

    const query = `UPDATE relationships SET ${setClause.query} WHERE TRUE ${whereClause.query}`;
    const values = [...setClause.values, ...whereClause.values];

    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        groupErrors.push(`${grammar} not found with the given search criteria`)
      }
    } 
    catch (err) {
      groupErrors.push(...constraintsRelationship(err, entryResult));
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