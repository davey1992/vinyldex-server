const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, sanitizeColumns, buildWhereClause, validateSearchInput} = require('../utils/database-helpers');
const {constraintsListEntry} = require('../utils/constraints.js');
const {schemaListEntry} = require('../utils/schema.js');

router.post('/add/list-entry', async (req, res) => {  
  const listEntryResults = await validatedInserts(req.body, schemaListEntry());
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
         groupErrors.push(...constraintsListEntry(err, cleanedListEntry));
      }
    }

    const sendUser = returnAddJSON(req, grammar, groupErrors);
    return res.status(sendUser.status).json(
      sendUser.data
    );
});

router.post('/read/list-entries', async (req, res) => {
  const result = await basicReadTemplate(req, res, schemaListEntry, 'list_entries', false);
  console.log(result.data);
});

module.exports = router;