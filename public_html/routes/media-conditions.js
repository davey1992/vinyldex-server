const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON, validatedEntries, validatedEntry} = require('../utils/helpers');
const {schemaMediaCondition} = require('../utils/schema.js');

router.post('/add/media-condition', async (req, res) => {
  const mediaConditionResults = await validatedEntries(req.body, schemaMediaCondition);
  const cleanMediaConditions = mediaConditionResults.entries;
  const groupErrors = mediaConditionResults.errors;

  const grammar = req.body.length == 1 ? 'Media Condition' : 'Media Conditions';

  if (cleanMediaConditions.length == 0) {
    log('No ' + grammar + ' have been added');
    log(groupErrors);

    return res.status(400).json({
      success:false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: groupErrors
    });
  }

  for (const cleanMediaCondition of cleanMediaConditions) {
    const query = `
      INSERT INTO media_conditions (
        condition,
        description
      )
      VALUES (
        $1,
        $2
      )
      RETURNING id;
    `;
    
    const values = [
      cleanMediaCondition.condition,
      cleanMediaCondition.description,
    ];

    try {
      const result = await pool.query(query, values);
      log("Entry: Created - " + cleanMediaCondition.condition);
    } 
    catch (err) {
      if (err.code === '23505') {
        if (err.constraint === 'unique_media_condition') {
          log('Invalid mediaCondition: already exists');
          groupErrors.push(`Invalid mediaCondition: (${cleanMediaCondition.condition}) already exists`);
        }
      }
      else {
        console.error('Database insert error:', err);
      }
    }
  }

  const sendUser = returnAddJSON(req, grammar, groupErrors);
  return res.status(sendUser.status).json(
    sendUser.data
  );
});

module.exports = router;