const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, sanitizeColumns, buildWhereClause, validateSearchInput} = require('../utils/database-helpers');
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


module.exports = router;