const express = require('express');
const bcrypt = require('bcrypt');

const pool = require('../config/db');
const router = express.Router();

const {returnAddJSON, log} = require('../utils/helpers');
const {schemaUser} = require('../utils/schema.js');

router.post('/add/user', async (req, res) => {
  const pepper = process.env.VINDEX_PEPPER;
  const reqBody = Array.isArray(req.body) ? req.body : [req.body];
  const grammar = reqBody.length == 1 ? 'User' : 'Users';
  
  let hashedPassword;
  let cleanedUsers = [];
  let groupErrors = [];

  //VALIDATE FIRST WITHOUT THIS VALIDATEASYNC WILL FAIL ON ALL OF THEM WHICH IS NOT WHAT WE WANT
  //INITIAL DATA VALIDATION
  for (const value of reqBody) {
    try {
      const tempUser = await schemaUser.validateAsync(value, {stripUnknown: true});
      cleanedUsers.push(tempUser);
    } 
    catch (err) {
      groupErrors.push(err.details[0].message + " - " + value.displayName);
    }
  }
  
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
      cleanedUser.displayName,
      cleanedUser.email,
      hashedPassword,
      cleanedUser.accountType,
      cleanedUser.visibility,
      cleanedUser.state,
      cleanedUser.properties
    ];

    try {
      const result = await pool.query(query, values);
      log("User: Created - " + cleanedUser.displayName);
    } 
    catch (err) {
      //DUPLICATE CONSTRAINTS
      if (err.code === '23505') {
        if (err.constraint === 'unique_display_name') {
          log(`Invalid displayName: (${cleanedUser.displayName}) already exists`);
          groupErrors.push(`Invalid displayName: (${cleanedUser.displayName}) already exists`);
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

module.exports = router;