const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {columnSanitizer, log, returnAddJSON, validatedEntries, validatedEntry} = require('../utils/helpers');
const {schemaEntry} = require('../utils/schema.js');

router.post('/add/entry', async (req, res) => {
  const entryResults = await validatedEntries(req.body, schemaEntry());
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
   
      //FORIGN KEY VALIDATION ISSUES
      if (err.code === '23503') {
        let errorMessage = 'Invalid primary key constraint';
    
        switch (err.constraint) {
          case 'fk_entry_user':
            groupErrors.push(`Invalid user_id: (${cleanedEntry.user_id}) does not exist`);
          break;
          case 'fk_entry_hierarchy':
            groupErrors.push(`Invalid parent_id: (${cleanedEntry.parent_id}) does not exist`);
          break;
          case 'fk_media_condition':
            groupErrors.push(`Invalid media_condition: (${cleanedEntry.media_condition}) does not exist`);
          break;
          case 'fk_sleeve_condition':
            groupErrors.push(`Invalid sleeve_condition: (${cleanedEntry.sleeve_condition}) does not exist`);
          break;
          case 'fk_user_id':
            groupErrors.push(`Invalid user_id: (${cleanedEntry.user_id}) does not exist`);
          break;
          case 'fk_media_format':
            groupErrors.push(`Invalid media_format: (${cleanedEntry.media_format}) does not exist`);
          break;
          default:
            log(err);
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


// const groupError = entryResult.error;
router.post('/read/entries', async (req, res) => {
  if (!req.body.search || typeof req.body.search !== 'object' || Array.isArray(req.body.search)) {
    log('Entries must be an object');
    return res.status(500).json({
      success:false,
      type: 'invalid_type',
      message: 'Entries must be an object',
      error: ['Invalid Entry Type']
    });
  }

  if (req.body.search.length === 0) {
    log('Please include req.body.search in your JSON');
    return res.status(500).json({
      success:false,
      type: 'json_error',
      message: 'Incorrect JSON Supplied',
      error: ['Invalid JSON Type']
    });
  }
 
  const chosenColumns = columnSanitizer(req.body.columns, schemaEntry());
  const entryResult = await validatedEntry(req.body.search, schemaEntry(true));
  const cleanedEntry = entryResult.entry;
  const values = [];

  let counter = 0;
  let searchColumns = "";

  try {
    Object.entries(cleanedEntry).forEach(([key, value]) => {
      counter++;
      values.push(value);
      searchColumns += ` AND "${key}" = $${counter}`;
    });

    const query = `SELECT ${chosenColumns} FROM entries WHERE true ${searchColumns}`;
    const result = await pool.query(query, values);
    log(result.rows);
  } 
  catch (err) {
    log(`[Security/Validation Warning]: ${err.message}`);
    return res.status(400).json({
      success: false,
      type: 'json_error',
      message: 'Incorrect JSON Supplied',
      error: ['Invalid JSON Type']
    });
  }
});

module.exports = router;