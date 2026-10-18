const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON, validatedEntries, validatedEntry} = require('../utils/helpers');
const {schemaListEntry} = require('../utils/schema.js');

router.post('/add/list-entry', async (req, res) => {  
  const listEntryResults = await validatedEntries(req.body, schemaListEntry());
  const cleanedListEntries = listEntryResults.entries;
  const groupErrors = listEntryResults.errors;

  const grammar = req.body.length == 1 ? 'List Entry' : 'List Entries';

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
        cleanedListEntry.list_id,
        cleanedListEntry.entry_id,
        cleanedListEntry.position_order
      ];

      try {
        const result = await pool.query(query, values);
        log(`Entry List: Created - ${cleanedListEntry.list_id}`);
      } 
      catch (err) {
        //FORIGN KEY VALIDATION ISSUES
        if (err.code === '23503') {
          let errorMessage = 'Invalid primary key constraint';
      
          switch (err.constraint) {
            case 'fk_list_id':
              errorMessage = `Invalid list_id: (${cleanedListEntry.list_id}) list does not exist`;
              groupErrors.push(`Invalid list_id: (${cleanedListEntry.list_id}) list does not exist`);
            break;
            case 'fk_entry_id':
              errorMessage = `Invalid entry_id: (${cleanedListEntry.entry_id}) does not exist`;
              groupErrors.push(`Invalid entry_id: (${cleanedListEntry.entry_id}) does not exist`);
            break;
            default: 
              console.error('Unexpected database error:', err);
          }
        }
        else if (err.code === '23505') {
          if(err.constraint === 'unique_list_id_entry_id') {
              log(`Invalid list_id: (${cleanedListEntry.list_id}) entry_id: (${cleanedListEntry.entry_id}) already exists`);
              groupErrors.push(`Invalid list_id: (${cleanedListEntry.list_id}) entry_id: (${cleanedListEntry.entry_id}) already exists`);
          }
          else {
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