const pool = require('../config/db');

const path = require('path');
const joi = require('joi');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const DEBUG = process.env.NODE_ENV === 'dev';

const {log} = require('./helpers');

const acceptedOperators = ["=","!=","<",">","LIKE"];


const sanitizeColumns = (chosenColumns, schema) => { 
  if (
    chosenColumns === undefined ||
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
const validatedInserts = async(json, schema) => {
  const reqBody = Array.isArray(json) ? json : [json];
  const entries = [];
  const errors = [];

  for (const item of reqBody) {
    try {
      //THIS IS TO SUPPORT UPDATE ENTRY AND ADD ENTRY
      const targetData = item.values ? item.values : item;
      const tempEntry = await schema.validateAsync(targetData, {stripUnknown: true});
      entries.push(tempEntry);
    } 
    catch (err) {
      errors.push(err.details[0].message + " - " + item.title);
    }
  }

  return {
    entries,
    errors
  }
}

const validatedUpdates = async(json, schema) => {
  const reqBody = Array.isArray(json) ? json : [json];
  const values = [];
  const errors = [];
  const search = [];

  // item of reqBody
  for (let i = 0; i < reqBody.length; i++) {
    try {
      //THIS IS TO SUPPORT UPDATE ENTRY AND ADD ENTRY
      const targetData = reqBody[i].values ? reqBody[i].values : reqBody[i];
      const tempEntry = await schema.validateAsync(targetData, {stripUnknown: true});
      values.push(tempEntry);
      search.push(reqBody[i].search);
    } 
    catch (err) {
      errors.push(err.details[0].message + " - " + reqBody[i].title);
    }
  }

  return {
    values,
    errors,
    search
  }
}

const buildSetClause = (json, schema) => {
  const values = [];
  const schemaKeys = Object.keys(schema.describe().keys);
  let counter = 0;
  let query = ``;

  if (typeof json !== 'object') {
    console.log('Error Type');
    return {}
  }

  for (const [key, value] of Object.entries(json)) {
    //IF MATCH IN KEY
    counter++;
    if (schemaKeys.includes(key)) {
      //CONJUNCTION
      if (counter > 1) {
        query += `, `;
      }
      query += `${key} = $${counter}`;
      values.push(value);
    }
  }
  return {query, values}
}

const buildWhereClause = (searchJSON, offset = 0) => {
  const values = [];
  let counter = 0;
  let query = "";

  if (!Array.isArray(searchJSON)) {
    console.log('Error Type');
    return {}
  }

  for (const item of searchJSON) {
    item.operator = item.operator.toUpperCase();
    let caseSensitiveString = `${item.field}`;
    let valueString = "";
    let queryOperator = "=";
  
    valueString = item.value;

    if (item.caseSensitive) {
        if (typeof item.value === "string") {
          caseSensitiveString = `LOWER(${item.field})`;
          valueString = item.value.toLowerCase();
        }
    }

    if (item.operator === "LIKE") {
      valueString = `%${valueString}%`;
    }

    if (acceptedOperators.includes(item.operator)) {
      counter++;
      values.push(valueString);

      queryOperator = item.operator;
      query += ` AND ${caseSensitiveString} ${queryOperator} $${ counter + offset}`;
      
    }
  }
  return {query, values}
}
const validateSearchInput = async (json, schema) => {
  // DESIGNED TO CLEAN THE JSON AS ALL OF THIS MAY NOT BE APPLIED
  if (!json || (typeof json === 'object' && Object.keys(json).length === 0)) {
    return [];
  }
  let search = [];
  let entry;
  let error;

  for (let jsonItem of json) {
    if (!jsonItem || !jsonItem.field) {
      continue;
    }
    let tempBuilder = {}; 
    tempBuilder[jsonItem.field] = jsonItem.value;

    try {
      entry = await schema.validateAsync(tempBuilder, { stripUnknown: true });
      
      const fieldKey = Object.keys(entry)[0];

      if (search !== undefined) {
        search.push({
          field: fieldKey,
          value: entry[fieldKey],
          operator: jsonItem.operator ?? '=',
          caseSensitive: jsonItem.caseSensitive ?? false
        });
      }
    } 
    catch (err) {
      error = err.details[0].message;
    }
  }
  
  return search;
};

const validatedUpdateBuilder = () => {

}

const basicReadTemplate = async(req, res, schemaFunction, tableName, allowEmptySearch = false) => {

    if (!req.body.search) {
      if (allowEmptySearch === false) {
        log(`Search object must exist for ${tableName}`);
        return res.status(400).json({ 
            success: false, 
            type: 'invalid_type', 
            message: 'Search must be an object' 
        });
      }
    }

    try {
        const chosenColumns = sanitizeColumns(req.body.columns, schemaFunction());
        const searchJSON = await validateSearchInput(req.body.search, schemaFunction(true));
        const querySearch = buildWhereClause(searchJSON);
    
        
        const query = `SELECT ${chosenColumns} FROM ${tableName} WHERE true ${querySearch.searchColumns}`;
        const result = await pool.query(query, querySearch.values);
        

        console.log(query);
        return { 
            success: true, 
            data: result.rows 
        };
    } 
    catch (err) {
        log(`[Security/Validation Warning]: ${err.message}`);
        return { 
            success: false, 
            type: 'json_error', 
            message: 'Incorrect JSON Supplied' 
        };
    }
}

module.exports = {
    basicReadTemplate,
    sanitizeColumns,
    validatedInserts,
    validatedUpdates,
    buildWhereClause,
    validateSearchInput,
    validatedUpdateBuilder,
    buildSetClause
};