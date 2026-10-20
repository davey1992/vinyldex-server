const path = require('path');
const joi = require('joi');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const DEBUG = process.env.NODE_ENV === 'dev';



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

module.exports = {
  log,
  returnAddJSON,
  toSnakeCase,
};