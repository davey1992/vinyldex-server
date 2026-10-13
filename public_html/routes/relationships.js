const express = require('express');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON, validatedEntries, validatedEntry} = require('../utils/helpers');
const {schemaRelationship} = require('../utils/schema.js');

router.post('/add/relationship', async (req, res) => {
  const relationshipResults = await validatedEntries(req.body, schemaRelationship);
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
      cleanRelationship.userID,
      cleanRelationship.targetUserID,
      cleanRelationship.relationshipTypes
    ];

    try {
      const result = await pool.query(query, values);
      log("Relationship: Created - " + cleanRelationship.userID + ' - ' + cleanRelationship.targetUserID);
    } 
    catch (err) {
      if (err.code === '23503') {
        switch (err.constraint) {
          case 'fk_relationship_user_id':
            log(`Invalid userID: ${cleanRelationship.userID} does not exist`);
            groupErrors.push(`Invalid userID: ${cleanRelationship.userID} does not exist`);
            break;
          case 'fk_relationship_user_target_id':
            log(`Invalid targetUserID: ${cleanRelationship.targetUserID} does not exist`);
            groupErrors.push(`Invalid targetUserID: ${cleanRelationship.targetUserID} does not exist`);
            break;
          default:
            console.error('Database insert error:', err);
        }
      }
      else if (err.code === '23505') {
        if (err.constraint === 'unique_user_target') {
          log(`Invalid userTarget: already assigned (${cleanRelationship.userID} -> ${cleanRelationship.targetUserID})`);
          groupErrors.push(`Invalid userTarget: already assigned for userID ${cleanRelationship.userID}`);
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

module.exports = router;