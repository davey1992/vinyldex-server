const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {returnAddJSON, log} = require('../utils/helpers');
const {schemaList} = require('../utils/schema.js');

router.post('/add/list', async (req, res) => {
  const reqBody = Array.isArray(req.body) ? req.body : [req.body];
  const grammar = reqBody.length == 1 ? 'List' : 'Lists';

  let cleanedLists = [];
  let groupErrors = [];

  for (const value of reqBody) {
    try {
      const tempList = await schemaList.validateAsync(value, { stripUnknown: true });
      cleanedLists.push(tempList);
    } 
    catch (err) {
      groupErrors.push(err.details[0].message + " - " + (value.name || 'unknown'));
    }
  }
  
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
      cleanedList.userID,
      cleanedList.name,
      cleanedList.description,
      cleanedList.type,
      cleanedList.isPublic,
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
          log(`Invalid userID: ${cleanedList.userID} does not exist`);
          groupErrors.push(`Invalid userID: ${cleanedList.userID} does not exist`);
        } else {
          console.error('Unexpected database error:', err);
        }
      }
      else if (err.code === '23505') {
        if (err.constraint === 'unique_user_list_name') {
          log(`Invalid userID (${cleanedList.userID}) , name (${cleanedList.name}): Duplicate list name for this user`);
          groupErrors.push(`Invalid userID (${cleanedList.userID}) , name (${cleanedList.name}): Duplicate list name for this user`);
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

module.exports = router;