const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, validatedUpdates, buildSetClause, sanitizeColumns, buildWhereClause, validateSearchInput} = require('../utils/database-helpers');
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

router.post('/update/list-entry', async (req, res) => {
  const entryResults = await validatedUpdates(req.body, schemaListEntry(true));
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
    const setClause = buildSetClause(entryResult, schemaListEntry());

    const searchCriteria = await validateSearchInput(entryResults.search[i], schemaListEntry(true));
    const whereClause = buildWhereClause(searchCriteria, setClause.values.length);

    const query = `UPDATE list_entries SET ${setClause.query} WHERE TRUE ${whereClause.query}`;
    const values = [...setClause.values, ...whereClause.values];

    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        groupErrors.push(`${grammar} not found with the given search criteria`)
      }
    } 
    catch (err) {
      groupErrors.push(...constraintsListEntry(err, entryResult));
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