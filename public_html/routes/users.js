const express = require('express');
const bcrypt = require('bcrypt');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, sanitizeColumns, validatedQuerySearch, validatedSearchJSON} = require('../utils/database-helpers');
const {schemaUser} = require('../utils/schema.js');

router.post('/add/user', async (req, res) => {
  const userResults = await validatedInserts(req.body, schemaUser());
  const cleanedUsers = userResults.entries;
  const groupErrors = userResults.errors;

  const pepper = process.env.VINDEX_PEPPER;
  const grammar = req.body.length == 1 ? 'User' : 'Users';
  let hashedPassword;

  if (cleanedUsers.length == 0) {
    log('No users have been added');
    log(groupErrors);

    return res.status(400).json({
      success:false,
      type: 'database_error',
      message: 'No users have been added',
      error: groupErrors
    });
  }

  for (const cleanedUser of cleanedUsers) {
    hashedPassword = await bcrypt.hash(pepper + cleanedUser.password, 10);
  
    const query = `
      INSERT INTO users (
        display_name,
        email,
        password,
        account_type,
        visibility,
        state,
        properties
      )
        VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
      )
      RETURNING id;
    `;
    
    const values = [
      cleanedUser.display_name,
      cleanedUser.email,
      hashedPassword,
      cleanedUser.account_type,
      cleanedUser.visibility,
      cleanedUser.state,
      cleanedUser.properties
    ];

    try {
      const result = await pool.query(query, values);
      log("User: Created - " + cleanedUser.display_name);
    } 
    catch (err) {
      //DUPLICATE CONSTRAINTS
      if (err.code === '23505') {
        if (err.constraint === 'unique_display_name') {
          log(`Invalid display_name: (${cleanedUser.display_name}) already exists`);
          groupErrors.push(`Invalid display_name: (${cleanedUser.display_name}) already exists`);
        }
        else if (err.constraint === 'unique_email') {
          log(`Invalid email: (${cleanedUser.email}) already exists`);
          groupErrors.push(`Invalid email: (${cleanedUser.email}) already exists`);
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


router.post('/read/users', async (req, res) => {
  const result = await basicReadTemplate(req, res, schemaUser, 'users', false);
  console.log(result.data);
});

module.exports = router;