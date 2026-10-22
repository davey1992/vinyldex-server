const express = require('express');

const pool = require('../config/db');
const router = express.Router();


const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, validatedUpdates, buildSetClause, validatedUpdateBuilder, sanitizeColumns, buildWhereClause, validateSearchInput} = require('../utils/database-helpers');
const {constraintsEntry} = require('../utils/constraints.js');
const {schemaEntry} = require('../utils/schema.js');

router.post('/add/entry', async (req, res) => {
  const entryResults = await validatedInserts(req.body, schemaEntry());
  const cleanedEntries = entryResults.entries;
  const groupErrors = entryResults.errors;

  const grammar = req.body.length == 1 ? 'Entry' : 'Entries';

  if (cleanedEntries.length == 0) {
    log('No ' + grammar + ' have been added');
    log(groupErrors);

    return res.status(400).json({
      success:false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: groupErrors
    });
  }

  for (const cleanedEntry of cleanedEntries) {
    const query = `
      INSERT INTO entries (
        user_id,
        parent_id,
        title, 
        artist,
        location,
        item_ref, 
        media_condition,
        sleeve_condition,
        personal_rating,
        bpm, 
        spin_speed,
        art_work,
        media_format,
        camelot_code, 
        internal_duplicate, 
        label_name, 
        country_code, 
        purchase_price,
        release_year,
        notes, 
        discogs_release_id,
        catalog_number,
        properties
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10, 
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18,
        $19,
        $20, 
        $21,
        $22,
        $23
      )
      RETURNING id;
    `;
    
    const values = [
      cleanedEntry.user_id,
      cleanedEntry.parent_id,
      cleanedEntry.title,
      cleanedEntry.artist,
      cleanedEntry.location,
      cleanedEntry.item_ref,
      cleanedEntry.media_condition,
      cleanedEntry.sleeve_condition,
      cleanedEntry.personal_rating,
      cleanedEntry.bpm,
      cleanedEntry.spin_speed,
      cleanedEntry.art_work,
      cleanedEntry.media_format,
      cleanedEntry.camelot_code,
      cleanedEntry.internal_duplicate,
      cleanedEntry.label_name,
      cleanedEntry.country_code,
      cleanedEntry.purchase_price,
      cleanedEntry.release_year,
      cleanedEntry.notes,
      cleanedEntry.discogs_release_id,
      cleanedEntry.catalog_number,
      cleanedEntry.properties
    ];

    try {
      const result = await pool.query(query, values);
      log("Entry: Created - " + cleanedEntry.title);
    } 
    catch (err) {
      groupErrors.push(...constraintsEntry(err, cleanedEntry));
    }
  }

  const sendUser = returnAddJSON(req, grammar, groupErrors);
  return res.status(sendUser.status).json(
    sendUser.data
  );
});

router.post('/update/entry', async (req, res) => {
  const entryResults = await validatedUpdates(req.body, schemaEntry(true));
  const grammar = entryResults.values.length == 1 ? 'Entry' : 'Entries';
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
    const setClause = buildSetClause(entryResult, schemaEntry());

    const searchCriteria = await validateSearchInput(entryResults.search[i], schemaEntry(true));
    const whereClause = buildWhereClause(searchCriteria, setClause.values.length);

    const query = `UPDATE entries SET ${setClause.query} WHERE TRUE ${whereClause.query}`;
    const values = [...setClause.values, ...whereClause.values];

    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        groupErrors.push(`${grammar} not found with the given search criteria`)
      }
    } 
    catch (err) {
      groupErrors.push(...constraintsEntry(err, entryResult));
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

router.post('/read/entries', async (req, res) => {
  const result = await basicReadTemplate(req, res, schemaEntry, 'entries', false);
  console.log(result.data);
});

module.exports = router;