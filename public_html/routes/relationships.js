const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedEntries, sanitizeColumns, validatedQuerySearch, validatedSearchJSON} = require('../utils/database-helpers');
const {schemaRelationship} = require('../utils/schema.js');

router.post('/add/relationship', async (req, res) => {
  const relationshipResults = await validatedEntries(req.body, schemaRelationship());
  const cleanedRelationships = relationshipResults.entries;
  const groupErrors = relationshipResults.errors;

  const grammar = req.body.length == 1 ? 'Relationship' : 'Relationships';

  if (cleanedRelationships.length == 0) {
    log('No ' + grammar + ' have been added');
    log(groupErrors);

    return res.status(400).json({
      success: false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: groupErrors
    });
  }

  for (const cleanRelationship of cleanedRelationships) {
    const query = `
      INSERT INTO relationships (
        user_id,
        target_user_id, 
        relationship_types
      )
      VALUES (
        $1,
        $2,
        $3
      )
      RETURNING id;
    `;
    
    const values = [
      cleanRelationship.user_id,
      cleanRelationship.target_user_id,
      cleanRelationship.relationship_types
    ];

    try {
      const result = await pool.query(query, values);
      log("Relationship: Created - " + cleanRelationship.user_id + ' - ' + cleanRelationship.target_user_id);
    } 
    catch (err) {
      if (err.code === '23503') {
        switch (err.constraint) {
          case 'fk_relationship_user_id':
            log(`Invalid user_id: ${cleanRelationship.user_id} does not exist`);
            groupErrors.push(`Invalid user_id: ${cleanRelationship.user_id} does not exist`);
            break;
          case 'fk_relationship_user_target_id':
            log(`Invalid target_user_id: ${cleanRelationship.target_user_id} does not exist`);
            groupErrors.push(`Invalid target_user_id: ${cleanRelationship.target_user_id} does not exist`);
            break;
          default:
            console.error('Database insert error:', err);
        }
      }
      else if (err.code === '23505') {
        if (err.constraint === 'unique_user_target') {
          log(`Invalid userTarget: already assigned (${cleanRelationship.user_id} -> ${cleanRelationship.target_user_id})`);
          groupErrors.push(`Invalid userTarget: already assigned for user_id ${cleanRelationship.user_id}`);
        }
        else {
          console.error('Database insert error:', err);
        }
      } 
      else {
        console.error('Database insert error:', err);
      }
    }
  }

  const sendUser = returnAddJSON(req, grammar, groupErrors);
  return res.status(sendUser.status).json(sendUser.data);
});

router.post('/read/relationships', async (req, res) => {
  const result = await basicReadTemplate(req, res, schemaRelationship, 'relationships', false);
  console.log(result.data);
});

module.exports = router;