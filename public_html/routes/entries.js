const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON, validatedEntries, validatedEntry} = require('../utils/helpers');
const {schemaEntry} = require('../utils/schema.js');

router.post('/add/entry', async (req, res) => {
  const entryResults = await validatedEntries(req.body, schemaEntry);
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
      cleanedEntry.userID,
      cleanedEntry.parentID,
      cleanedEntry.title,
      cleanedEntry.artist,
      cleanedEntry.location,
      cleanedEntry.itemRef,
      cleanedEntry.mediaCondition,
      cleanedEntry.sleeveCondition,
      cleanedEntry.personalRating,
      cleanedEntry.bpm,
      cleanedEntry.spinSpeed,
      cleanedEntry.artWork,
      cleanedEntry.mediaFormat,
      cleanedEntry.camelotCode,
      cleanedEntry.internalDuplicate,
      cleanedEntry.labelName,
      cleanedEntry.countryCode,
      cleanedEntry.purchasePrice,
      cleanedEntry.releaseYear,
      cleanedEntry.notes,
      cleanedEntry.discogsReleaseID,
      cleanedEntry.catalogNumber,
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
            groupErrors.push(`Invalid userID: (${cleanedEntry.userID}) does not exist`);
          break;
          case 'fk_entry_hierarchy':
            groupErrors.push(`Invalid parentID: (${cleanedEntry.parentID}) does not exist`);
          break;
          case 'fk_media_condition':
            groupErrors.push(`Invalid mediaCondition: (${cleanedEntry.mediaCondition}) does not exist`);
          break;
          case 'fk_sleeve_condition':
            groupErrors.push(`Invalid sleeveCondition: (${cleanedEntry.sleeveCondition}) does not exist`);
          break;
          case 'fk_user_id':
            groupErrors.push(`Invalid userID: (${cleanedEntry.userID}) does not exist`);
          break;
          case 'fk_media_format':
            groupErrors.push(`Invalid mediaFormat: (${cleanedEntry.mediaFormat}) does not exist`);
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

router.put('/read/entries', async (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    log('Entries must be an object');
    return res.status(500).json({
      success:false,
      type: 'invalid_type',
      message: 'Entries must be an object',
      error: ['Invalid Entry Type']
    });
  }

  const entryResult = await validatedEntry(req.body, schemaEntry);
  const cleanedEntry = entryResult.entry;
  const groupError = entryResult.error;

  log(cleanedEntry);  
});

module.exports = router;