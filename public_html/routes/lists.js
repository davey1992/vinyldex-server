const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, sanitizeColumns, validatedQuerySearch, validatedSearchJSON} = require('../utils/database-helpers');
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
      if (err.code === '23503') {
        if (err.constraint === 'fk_user_id') {
          log(`Invalid user_id: ${cleanedList.user_id} does not exist`);
          groupErrors.push(`Invalid user_id: ${cleanedList.user_id} does not exist`);
        } else {
          console.error('Unexpected database error:', err);
        }
      }
      else if (err.code === '23505') {
        if (err.constraint === 'unique_user_list_name') {
          log(`Invalid user_id (${cleanedList.user_id}) , name (${cleanedList.name}): Duplicate list name for this user`);
          groupErrors.push(`Invalid user_id (${cleanedList.user_id}) , name (${cleanedList.name}): Duplicate list name for this user`);
        } else {
          console.error('Unexpected database error:', err);
        }
      }
      else {
        console.error('Unexpected database error:', err);
      }
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