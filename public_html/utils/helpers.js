const path = require('path');
const joi = require('joi');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const DEBUG = process.env.NODE_ENV === 'dev';


const columnSanitizer = (chosenColumns, schema) => {
  if (
    !Array.isArray(chosenColumns) || 
    chosenColumns.length === 0
  ) {
    return "*";
  }

  const columnString = chosenColumns.join(',');

  if (!/^[a-z0-9_,]+$/.test(columnString)) {
    throw new Error('Security violation: Invalid column characters detected.');
  }

  const keys = Object.keys(schema.describe().keys);
  for (const column of chosenColumns) {
    if(keys.includes(column) === false) {
        throw new Error('Security violation: Invalid column');
    }
  }

  return columnString;
}

const log = (message) => {
  if (DEBUG) {
    console.log(message);
  }
}

const returnAddJSON = (req, grammar, groupErrors) => {
  const reqBody = Array.isArray(req.body) ? req.body : [req.body];

  if (groupErrors.length == reqBody.length) {
    const statusMessage = 'No ' + grammar + ' were added';
    log(statusMessage);
    log(groupErrors);
    
    return {
      status: 400,
      data: {
          success: false,
          type: 'database_error',
          message: statusMessage,
          errors: groupErrors
      }
    };
  }
  else if (groupErrors.length > 0){
    const statusMessage = 'Added some ' + grammar + ' in database! See errors';
    log(statusMessage);
    log(groupErrors);
    
    return {
      status: 400,
      data: {
          success: false,
          type: 'database_error',
          message: statusMessage,
          errors: groupErrors
      }
    };
  }
  else {
    const statusMessage = grammar + ' created in database! No errors';
    log(statusMessage);
    
    return {
      status: 201,
      data: {
          success: true,
          type: 'success',
          message: statusMessage
      }
    };
  }
}

const toSnakeCase = (str) => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
}; 

const validatedEntries = async(json, schema) => {
  const reqBody = Array.isArray(json) ? json : [json];
  const entries = [];
  const errors = [];

  for (const value of reqBody) {
    try {
      const tempEntry = await schema.validateAsync(value, {stripUnknown: true});
      entries.push(tempEntry);
    } 
    catch (err) {
      errors.push(err.details[0].message + " - " + value.title);
    }
  }

  return {
    entries,
    errors
  }
}

const validatedEntry = async (json, schema) => {
  let entry;
  let error = '';

  try {
    entry = await schema.validateAsync(json, { stripUnknown: true });
  } 
  catch (err) {
    error = err.details[0].message;
  }   

  return {
    entry,
    error
  };
};


module.exports = {
  columnSanitizer,
  log,
  returnAddJSON,
  toSnakeCase,
  validatedEntries,
  validatedEntry
};