const express = require('express');
const bcrypt = require('bcrypt');

const pool = require('../config/db');
const router = express.Router();

const {log, returnAddJSON} = require('../utils/helpers');
const {basicReadTemplate, validatedInserts, validatedUpdates, buildSetClause, sanitizeColumns, buildWhereClause, validateSearchInput} = require('../utils/database-helpers');
const {constraintsUser} = require('../utils/constraints.js');
const {schemaUser} = require('../utils/schema.js');
const pepper = process.env.VINDEX_PEPPER;
router.post('/add/user', async (req, res) => {
  const userResults = await validatedInserts(req.body, schemaUser());
  const cleanedUsers = userResults.entries;
  const groupErrors = userResults.errors;


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
      groupErrors.push(...constraintsUser(err, cleanedUsers));
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

router.post('/update/user', async (req, res) => {
  const entryResults = await validatedUpdates(req.body, schemaUser(true));
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

    const setClause = buildSetClause(entryResult, schemaUser());
    const searchCriteria = await validateSearchInput(entryResults.search[i], schemaUser(true));
    const whereClause = buildWhereClause(searchCriteria, setClause.values.length);

    //ADJUST PASSWORD
    if (setClause.query.includes('password')) {
      const passwordCount = setClause.query.split(',').filter((result) => {
          return result.includes('password');
      }).length;
     
      setClause.values[passwordCount] = await bcrypt.hash(pepper + setClause.values[passwordCount], 10);
    }

    const query = `UPDATE users SET ${setClause.query} WHERE TRUE ${whereClause.query}`;
    const values = [...setClause.values, ...whereClause.values];

    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        groupErrors.push(`${grammar} not found with the given search criteria`)
      }
    } 
    catch (err) {
      groupErrors.push(...constraintsUser(err, entryResult));
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