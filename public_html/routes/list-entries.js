const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {returnAddJSON, log} = require('../utils/helpers');
const {schemaListEntry} = require('../utils/schema.js');

router.post('/add/list-entry', async (req, res) => {

  const reqBody = Array.isArray(req.body) ? req.body : [req.body];
  const grammar = reqBody.length == 1 ? 'List Entry' : 'List Entries';
  
  let cleanedListEntries = [];
  let groupErrors = [];

  // VALIDATE FIRST WITHOUT THIS VALIDATEASYNC WILL FAIL ON ALL OF THEM WHICH IS NOT WHAT WE WANT
  // INITIAL DATA VALIDATION
  for (const value of reqBody) {
    try {
      const tempListEntry = await schemaListEntry.validateAsync(value, {stripUnknown: true});
      cleanedListEntries.push(tempListEntry);
    } 
    catch (err) {
      groupErrors.push(err.details[0].message + " - " + value.listID);
    }
  }

  if (cleanedListEntries.length == 0) {
    log('No ' + grammar + ' have been added');
    log(groupErrors);

    return res.status(400).json({
      success:false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: groupErrors
    });
  }

  for (const cleanedListEntry of cleanedListEntries) {
      const query = `
        INSERT INTO list_entries (
          list_id,
          entry_id,
          position_order
        )
        VALUES (
          $1,
          $2,
          $3
        )
        RETURNING id;
      `;
      const values = [
        cleanedListEntry.listID,
        cleanedListEntry.entryID,
        cleanedListEntry.positionOrder
      ];

      try {
        const result = await pool.query(query, values);
        log(`Entry List: Created - ${cleanedListEntry.listID}`);
      } 
      catch (err) {
        //FORIGN KEY VALIDATION ISSUES
        if (err.code === '23503') {
          let errorMessage = 'Invalid primary key constraint';
      
          switch (err.constraint) {
            case 'fk_list_id':
              errorMessage = `Invalid listID: (${cleanedListEntry.listID}) list does not exist`;
              groupErrors.push(`Invalid listID: (${cleanedListEntry.listID}) list does not exist`);
            break;
            case 'fk_entry_id':
              errorMessage = `Invalid entryID: (${cleanedListEntry.entryID}) does not exist`;
              groupErrors.push(`Invalid entryID: (${cleanedListEntry.entryID}) does not exist`);
            break;
            default: 
              console.error('Unexpected database error:', err);
          }
        }
        else {
          console.error('Unexpected database error:', err);
        }
      }
    }

    const sendUser = returnAddJSON(req, grammar, groupErrors);
    return res.status(sendUser.status).json(
      sendUser.data
    );
});

module.exports = router;